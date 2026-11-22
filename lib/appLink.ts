import { playStoreUrl, SITE_URL } from './content'

type Utm = { source?: string | null; campaign?: string | null }

/**
 * Where a "Get the app" button points. On Android it is our own /get page,
 * which opens Qrio when it is already installed and otherwise goes to Google
 * Play with the same tags (a link straight to Play can never open the app).
 * Everywhere else it is the Play link itself. `medium` is where the button
 * sits (hero, blog, sticky and so on) and still reaches the install referrer.
 */
export function getAppUrl(medium: string, utm?: Utm, webId?: string, android = false) {
  if (!android) return playStoreUrl(medium, utm, webId)
  const q = new URLSearchParams({
    utm_source: utm?.source || 'website',
    utm_campaign: utm?.campaign || 'organic',
    from: medium,
  })
  if (webId) q.set('web_id', webId)
  return `/get?${q}`
}

export const isAndroid = () => /Android/i.test(navigator.userAgent)

/**
 * What the "send to my phone" QR code opens: /phone, which sends Android
 * straight to Google Play and offers iPhones the WhatsApp community. Short
 * keys keep the code low density and easy to scan. The visitor's utm_source,
 * campaign and analytics id ride along, so a QR install still credits the
 * source that sent them (utm_medium becomes site_qr, utm_term site_<spot>).
 */
export function phoneUrl(location: string, utm?: Utm, webId?: string) {
  const q = new URLSearchParams({ s: utm?.source || 'website' })
  if (utm?.campaign) q.set('c', utm.campaign)
  q.set('f', location)
  if (webId) q.set('w', webId)
  return `${SITE_URL}/phone?${q}`
}
