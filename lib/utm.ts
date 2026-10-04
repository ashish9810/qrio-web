const KEY = 'qrio_utm'

export type Utm = { source: string | null; campaign: string | null }

/**
 * Remembers utm_source / utm_campaign for the session, so they are still
 * attached if the visitor browses to another page before submitting a form.
 */
export function captureUtm() {
  try {
    const params = new URLSearchParams(window.location.search)
    const source = params.get('utm_source')
    const campaign = params.get('utm_campaign')
    if (source || campaign) {
      sessionStorage.setItem(KEY, JSON.stringify({ source, campaign }))
    }
  } catch {
    // Storage can be blocked (private mode). Attribution is best effort.
  }
}

export function getUtm(): Utm {
  try {
    const stored = sessionStorage.getItem(KEY)
    if (stored) return JSON.parse(stored) as Utm
  } catch {
    // Fall through to the URL.
  }
  const params = new URLSearchParams(window.location.search)
  return { source: params.get('utm_source'), campaign: params.get('utm_campaign') }
}
