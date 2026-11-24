import { SITE_NAME, SITE_URL } from './content'

/**
 * Pages shared by the short links /get and /phone: the link-preview page for
 * bots and the "open the app, else Google Play" page for Android.
 */

/** Keeps a utm value safe and short. */
export const clean = (v: string | null) =>
  v ? v.replace(/[^a-z0-9_.:\-]/gi, '').slice(0, 60) || null : null

export const PREVIEW = {
  title: 'Qrio: Get smarter every day',
  description:
    'Watch videos worth your time. Short videos on geopolitics, startups and business to keep you ahead.',
  image: `${SITE_URL}/og/get.jpg`,
  imageSize: 1080,
}

/** Link preview for a shared level (?open=mind). */
export const MIND_PREVIEW = {
  title: "What's your level on Qrio?",
  description:
    'Every video you watch builds your mind. See your level and your streak. Short videos on geopolitics, business and startups.',
  image: `${SITE_URL}/og/get.jpg`,
  imageSize: 1080,
}

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export type Preview = { title: string; description: string; image: string; tall?: boolean }

export function previewPage(target: string, p: Preview = PREVIEW, reel?: string, pageUrl?: string) {
  const url = pageUrl ?? (reel ? `${SITE_URL}/get?reel=${reel}` : `${SITE_URL}/get`)
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
export function openAppPage(intent: string, target: string) {
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
