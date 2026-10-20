import { playStoreUrl, SITE_NAME, SITE_URL } from '@/lib/content'

/**
 * Short link for posts and bios: qrioapp.in/get. Redirects to Google Play with
 * an install referrer. Add ?utm_source=instagram&utm_campaign=launch and those
 * tags are carried through, so Play Console shows where each install came from.
 * A route handler (not a config redirect) so the referrer keeps its encoding.
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

export function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const target = playStoreUrl('short_link', {
    source: params.get('utm_source'),
    campaign: params.get('utm_campaign'),
  })
  if (PREVIEW_BOTS.test(request.headers.get('user-agent') ?? '')) {
    return previewPage(target)
  }
  return Response.redirect(target, 307)
}
