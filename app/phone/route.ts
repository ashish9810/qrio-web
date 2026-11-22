import { after } from 'next/server'
import { Events } from '@/lib/analytics'
import { trackServer } from '@/lib/analytics-server'
import { playStoreUrl, SEND_TO_PHONE, SITE_URL, WHATSAPP_COMMUNITY_URL } from '@/lib/content'
import { classifyRequest, type PhoneDecision } from '@/lib/device'
import { clean, esc, PREVIEW, previewPage } from '@/lib/shortLink'

/**
 * qrioapp.in/phone: what the "send to my phone" QR code opens (see
 * components/SendToPhonePanel.tsx). The phone's camera opens its own browser,
 * and the server decides from the request headers:
 *
 *   Android  -> /get (opens the app if installed, else Google Play). No WhatsApp.
 *   iPhone   -> WhatsApp community, plus the iPhone waitlist. No Play button.
 *   Mac UA without client hints (could be an iPad in desktop mode) -> the
 *              "unsure" page, and a tiny script switches it to the iPhone
 *              layout when the screen has touch.
 *   Anything else -> Google Play first, WhatsApp community second.
 *
 * Query (kept short for a low-density QR): s = utm_source, c = utm_campaign,
 * f = which button, w = web_id. The install referrer then reads
 * utm_source=<s> utm_medium=site_qr utm_term=site_<f> web_id=<w>.
 */

const HEADERS = {
  'content-type': 'text/html; charset=utf-8',
  // The answer depends on the device, and the CDN keys on the URL only.
  'cache-control': 'private, no-store',
  vary: 'User-Agent, Sec-CH-UA-Platform',
  'x-robots-tag': 'noindex',
}

type Tags = { source: string; campaign: string | null; from: string; webId: string }

/** /get link that carries the QR's tags; /get handles the app-or-Play step. */
function getLink(t: Tags) {
  const q = new URLSearchParams({ utm_source: t.source, utm_medium: 'site_qr' })
  if (t.campaign) q.set('utm_campaign', t.campaign)
  q.set('from', t.from)
  if (t.webId) q.set('web_id', t.webId)
  return `/get?${q}`
}

function page(decision: PhoneDecision, t: Tags) {
  const ios = decision === 'ios'
  const waitlist = `/?${new URLSearchParams({ waitlist: 'iphone', utm_source: t.source, utm_medium: 'site_qr' })}`
  const whatsapp = `<a class="b wa" data-choice="whatsapp" href="${esc(WHATSAPP_COMMUNITY_URL)}" rel="noopener">${esc(SEND_TO_PHONE.whatsapp)}</a>`
  const play = `<a class="b" data-choice="play" href="${esc(getLink(t))}">${esc(SEND_TO_PHONE.play)}</a>`
  const waitlistLink = `<a class="l" data-choice="waitlist" href="${esc(waitlist)}">${esc(SEND_TO_PHONE.waitlist)}</a>`
  const body = ios
    ? `<h1>${esc(SEND_TO_PHONE.titleIos)}</h1>
<p>${esc(SEND_TO_PHONE.subIos)}</p>
${whatsapp}
${waitlistLink}`
    : `<h1 id="t">${esc(SEND_TO_PHONE.titleUnknown)}</h1>
<p id="p">${esc(SEND_TO_PHONE.subUnknown)}</p>
<div id="play">${play}</div>
${whatsapp}
<div id="wl" hidden>${waitlistLink}</div>`
  // An iPad in desktop mode looks like a Mac to the server; touch gives it away.
  const ipadCheck =
    decision === 'maybe_ipad'
      ? `if (navigator.maxTouchPoints > 1) {
  d = 'ios'
  document.getElementById('play').hidden = true
  document.getElementById('wl').hidden = false
  document.getElementById('t').textContent = ${JSON.stringify(SEND_TO_PHONE.titleIos)}
  document.getElementById('p').textContent = ${JSON.stringify(SEND_TO_PHONE.subIos)}
}`
      : ''
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Get Qrio on your phone</title>
<link rel="icon" href="/favicon.ico">
<style>
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#FAFAF7;color:#141414;text-align:center}
main{max-width:420px;margin:0 auto;padding:56px 20px}
.logo{font-family:Georgia,serif;font-size:30px;font-weight:600;letter-spacing:-.03em;color:#141414;text-decoration:none}
h1{font-family:Georgia,serif;font-weight:500;font-size:28px;line-height:1.15;margin:36px 0 8px}
p{color:#6B6B66;font-size:16px;line-height:1.5;margin:0 0 28px}
.b{display:flex;align-items:center;justify-content:center;min-height:52px;border-radius:999px;background:#3B3BD6;color:#fff;font-weight:600;font-size:16px;text-decoration:none;margin:0 0 14px}
.wa{background:#128C4A}
.l{display:inline-block;margin-top:8px;color:#3B3BD6;font-size:15px;text-decoration:underline}
</style>
</head>
<body>
<main>
<a class="logo" href="/">Qrio</a>
${body}
</main>
<script>
var d = ${JSON.stringify(decision)}
${ipadCheck}
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('[data-choice]')
  if (!a || !navigator.sendBeacon) return
  navigator.sendBeacon('/phone/choice', new URLSearchParams({ choice: a.getAttribute('data-choice'), decision: d, f: ${JSON.stringify(t.from)}, s: ${JSON.stringify(t.source)}, w: ${JSON.stringify(t.webId)} }))
})
</script>
</body>
</html>`
  return new Response(html, { headers: HEADERS })
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const t: Tags = {
    source: clean(params.get('s') ?? params.get('utm_source')) ?? 'website',
    campaign: clean(params.get('c') ?? params.get('utm_campaign')),
    from: (params.get('f') ?? params.get('from') ?? '').replace(/[^a-z0-9_]/gi, '').slice(0, 30) || 'qr',
    webId: (params.get('w') ?? params.get('web_id') ?? '').replace(/[^a-f0-9]/gi, '').slice(0, 32),
  }
  const decision = classifyRequest(request.headers)

  if (decision === 'bot') {
    const target = playStoreUrl(t.from, { source: t.source, campaign: t.campaign, medium: 'site_qr' })
    const res = previewPage(target, PREVIEW, undefined, `${SITE_URL}/phone`)
    res.headers.set('x-robots-tag', 'noindex')
    return res
  }

  after(() =>
    trackServer(Events.phonePageOpen, {
      decision,
      from: t.from,
      utm_source: t.source,
      utm_campaign: t.campaign ?? undefined,
      country: request.headers.get('x-vercel-ip-country') ?? undefined,
      web_id: t.webId || undefined,
    }),
  )

  if (decision === 'android') {
    // Straight on to /get: open the app if installed, else Google Play.
    return new Response(null, {
      status: 307,
      headers: { location: getLink(t), 'cache-control': 'private, no-store', vary: HEADERS.vary, 'x-robots-tag': 'noindex' },
    })
  }
  return page(decision, t)
}
