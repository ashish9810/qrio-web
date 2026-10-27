import { playStoreUrl, SITE_NAME, SITE_URL } from '@/lib/content'
import { getSupabase } from '@/lib/supabase'

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
 *
 * One video: ?reel=<id> (the app's Share and Copy link). The app opens that
 * video when installed; otherwise Play, and after install the app reads the
 * id from the install referrer and opens it (deferred deep link). Link
 * previews show that video's thumbnail and caption.
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

type Preview = { title: string; description: string; image: string; tall?: boolean }

/** Title, caption and thumbnail of a published video, for its link preview. */
async function reelPreview(id: string): Promise<Preview | null> {
  try {
    const { data } = await getSupabase()
      .from('reels')
      .select('caption, thumb_url, status, creators(name)')
      .eq('id', id)
      .eq('status', 'published')
      .maybeSingle()
    if (!data) return null
    const creator = (data.creators as { name?: string } | null)?.name ?? 'Qrio'
    const caption = (data.caption ?? '').replace(/\s+/g, ' ').trim()
    // Title: the caption's first sentence (what the video is about).
    const first = caption.split(/(?<=[.!?])\s/)[0] ?? ''
    const title = first.length > 90 ? `${first.slice(0, 87)}…` : first
    return {
      title: title || `${creator} on Qrio`,
      description:
        creator === 'Qrio'
          ? 'Watch on Qrio. Short videos on geopolitics, business and startups.'
          : `by ${creator}. Watch on Qrio: short videos on geopolitics, business and startups.`,
      image: data.thumb_url as string,
      tall: true,
    }
  } catch {
    return null
  }
}

function previewPage(target: string, p: Preview = PREVIEW, reel?: string) {
  const url = reel ? `${SITE_URL}/get?reel=${reel}` : `${SITE_URL}/get`
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:image" content="${esc(p.image)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="${p.tall ? 1080 : PREVIEW.imageSize}">
<meta property="og:image:height" content="${p.tall ? 1920 : PREVIEW.imageSize}">
<meta property="og:image:alt" content="${esc(p.title)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${esc(p.image)}">
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
      // Never cached by the CDN: it keys on the URL, not the user agent, so a
      // cached preview (made for WhatsApp's bot) would be served to real
      // visitors and skip opening the app.
      'cache-control': 'private, no-store',
      vary: 'User-Agent',
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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: Request) {
  const url = new URL(request.url)
  const params = url.searchParams
  const source = params.get('utm_source')
  const campaign = params.get('utm_campaign')
  // From the site's own buttons: where the button was and the visitor's
  // analytics id, so the install still credits that spot (see lib/appLink.ts).
  const from = (params.get('from') ?? '').replace(/[^a-z0-9_]/gi, '').slice(0, 30)
  const webId = (params.get('web_id') ?? '').replace(/[^a-f0-9]/gi, '').slice(0, 32)
  const reelParam = params.get('reel') ?? ''
  const reel = UUID.test(reelParam) ? reelParam.toLowerCase() : undefined
  const target = playStoreUrl(
    from || (reel ? 'share' : 'short_link'),
    { source, campaign },
    webId || undefined,
    reel,
  )
  const ua = request.headers.get('user-agent') ?? ''
  if (PREVIEW_BOTS.test(ua)) {
    const p = reel ? await reelPreview(reel) : null
    return previewPage(target, p ?? PREVIEW, reel)
  }
  if (/android/i.test(ua)) {
    // Only the tags travel to the app; nothing else from the query string.
    const tags = new URLSearchParams()
    if (source) tags.set('utm_source', source.slice(0, 60))
    if (campaign) tags.set('utm_campaign', campaign.slice(0, 60))
    if (reel) tags.set('reel', reel)
    const query = tags.toString() ? `?${tags}` : ''
    const intent =
      `intent://www.qrioapp.in/get${query}#Intent;scheme=https;package=com.qrio.qrio;` +
      `S.browser_fallback_url=${encodeURIComponent(target)};end`
    return openAppPage(intent, target)
  }
  return new Response(null, {
    status: 307,
    headers: { location: target, 'cache-control': 'no-store', vary: 'User-Agent' },
  })
}
