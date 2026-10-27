import { playStoreUrl, SITE_NAME, SITE_URL } from '@/lib/content'

/**
 * Short link for posts and bios: qrioapp.in/get. Redirects to Google Play with
 * an install referrer. Add ?utm_source=instagram&utm_campaign=launch and those
 * tags are carried through, so Play Console shows where each install came from.
 * A route handler (not a config redirect) so the referrer keeps its encoding.
 *
 * Already have Qrio? On Android the verified link (public/.well-known/
 * assetlinks.json + the app's intent filter) opens the app directly, before
 * this page is ever requested. When it did not (in-app browsers such as
 * Instagram's, or the app is not installed), Android visitors get a small page
 * that tries to open the app and, if that does not work within about two
 * seconds, goes to Google Play with the same tags. Everyone else is
 * redirected to Play straight away.
 *
 * Link previews: WhatsApp, LinkedIn, X, Telegram and the like fetch the link
 * to build the preview card. If they were redirected they would show Google
 * Play's card, so they get a small page with Qrio's own title and image
 * (public/og/get.jpg, 1080x1080) instead. Everyone else is redirected as
 * before.
 */
const PREVIEW_BOTS =
  /bot|crawler|spider|facebookexternalhit|facebot|whatsapp|telegram|slack|discord|linkedin|pinterest|skypeuripreview|vkshare|embedly|quora link|preview|iframely/i

const PREVIEW = {
  title: 'Qrio: Get smarter every day',
  description:
    'Watch videos worth your time. Short videos on geopolitics, startups and business to keep you ahead.',
  image: `${SITE_URL}/og/get.jpg`,
  imageSize: 1080,
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function previewPage(target: string) {
  const url = `${SITE_URL}/get`
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(PREVIEW.title)}</title>
<meta name="description" content="${esc(PREVIEW.description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(PREVIEW.title)}">
<meta property="og:description" content="${esc(PREVIEW.description)}">
<meta property="og:image" content="${esc(PREVIEW.image)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="${PREVIEW.imageSize}">
<meta property="og:image:height" content="${PREVIEW.imageSize}">
<meta property="og:image:alt" content="Qrio: get smarter every day. Short videos on geopolitics, startups and business.">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(PREVIEW.title)}">
<meta name="twitter:description" content="${esc(PREVIEW.description)}">
<meta name="twitter:image" content="${esc(PREVIEW.image)}">
<link rel="canonical" href="${esc(url)}">
<script>location.replace(${JSON.stringify(target)})</script>
</head>
<body style="font-family:system-ui,sans-serif;background:#111;color:#fff;text-align:center;padding:48px 20px">
<p><a href="${esc(target)}" style="color:#f0a030;font-size:20px">Get Qrio on Google Play</a></p>
</body>
</html>`
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=3600',
    },
  })
}

/**
 * Tries to open the installed app, then falls back to Google Play. The intent
 * link names the app's package, so Chrome opens it only if it is installed and
 * otherwise goes to browser_fallback_url (Play). The timer covers browsers that
 * ignore intent links: after two seconds, if the page is still showing, Play.
 */
function openAppPage(intent: string, target: string) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Opening Qrio</title>
</head>
<body style="font-family:system-ui,sans-serif;background:#111;color:#fff;text-align:center;padding:64px 20px">
<p style="font-size:20px">Opening Qrio...</p>
<p><a id="play" href="${esc(target)}" style="color:#f0a030;font-size:18px">Get Qrio on Google Play</a></p>
<script>
var t = setTimeout(function () { location.replace(${JSON.stringify(target)}) }, 2000)
function stop() { clearTimeout(t) }
document.addEventListener('visibilitychange', function () { if (document.hidden) stop() })
addEventListener('pagehide', stop)
location.href = ${JSON.stringify(intent)}
</script>
</body>
</html>`
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export function GET(request: Request) {
  const url = new URL(request.url)
  const params = url.searchParams
  const source = params.get('utm_source')
  const campaign = params.get('utm_campaign')
  // From the site's own buttons: where the button was and the visitor's
  // analytics id, so the install still credits that spot (see lib/appLink.ts).
  const from = (params.get('from') ?? '').replace(/[^a-z0-9_]/gi, '').slice(0, 30)
  const webId = (params.get('web_id') ?? '').replace(/[^a-f0-9]/gi, '').slice(0, 32)
  const target = playStoreUrl(from || 'short_link', { source, campaign }, webId || undefined)
  const ua = request.headers.get('user-agent') ?? ''
  if (PREVIEW_BOTS.test(ua)) {
    return previewPage(target)
  }
  if (/android/i.test(ua)) {
    // Only the tags travel to the app; nothing else from the query string.
    const tags = new URLSearchParams()
    if (source) tags.set('utm_source', source.slice(0, 60))
    if (campaign) tags.set('utm_campaign', campaign.slice(0, 60))
    const query = tags.toString() ? `?${tags}` : ''
    const intent =
      `intent://www.qrioapp.in/get${query}#Intent;scheme=https;package=com.qrio.qrio;` +
      `S.browser_fallback_url=${encodeURIComponent(target)};end`
    return openAppPage(intent, target)
  }
  return Response.redirect(target, 307)
}
