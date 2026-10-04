/** Event names. Keep them stable: renaming one starts a fresh series. */
export const Events = {
  pageView: 'page_view',
  ctaClick: 'cta_click',
  modalOpen: 'modal_open',
  waitlistSubmit: 'waitlist_submit',
  creatorFormSubmit: 'creator_form_submit',
} as const

export type CtaLocation = 'header' | 'hero' | 'final'

type Props = Record<string, string | number | boolean>
type PostHog = typeof import('posthog-js').default

let started = false
let client: PostHog | null = null
const queue: [string, Props | undefined][] = []

/**
 * No-op unless POSTHOG_KEY is set. posthog-js is loaded lazily once the browser
 * is idle, so it never competes with the hero for bandwidth. Events fired
 * before it is ready are queued and sent afterwards.
 *
 * Autocapture and session recording are off and storage is localStorage only,
 * so no cookies are set and no banner is needed. We send only the explicit
 * events above, never emails or numbers.
 */
export function initAnalytics(key?: string, host?: string) {
  if (started || !key || typeof window === 'undefined') return
  started = true

  const start = async () => {
    const { default: posthog } = await import('posthog-js')
    posthog.init(key, {
      api_host: host || 'https://us.i.posthog.com',
      capture_pageview: false,
      autocapture: false,
      disable_session_recording: true,
      persistence: 'localStorage',
      person_profiles: 'identified_only',
    })
    client = posthog
    for (const [event, props] of queue.splice(0)) posthog.capture(event, props)
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => void start(), { timeout: 3000 })
  } else {
    setTimeout(() => void start(), 1500)
  }
}

export function track(event: string, props?: Props) {
  if (!started) return
  if (client) client.capture(event, props)
  else queue.push([event, props])
}
