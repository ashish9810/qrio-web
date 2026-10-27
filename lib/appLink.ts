import { playStoreUrl } from './content'

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
