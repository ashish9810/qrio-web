/** Event names. Keep them stable: renaming one starts a fresh series. */
export const Events = {
  ctaClick: 'Web Download Click',
  modalOpen: 'Web Early Access Open',
  waitlistSubmit: 'Web Waitlist Submit',
  creatorFormSubmit: 'Web Creator Form Submit',
  scrollDepth: 'Web Scroll Depth',
  stickyShown: 'Web Sticky Bar Shown',
  stickyDismissed: 'Web Sticky Bar Dismissed',
} as const

export type CtaLocation = 'header' | 'hero' | 'final' | 'blog' | 'story' | 'sticky'

type Props = Record<string, string | number | boolean>
type Mixpanel = typeof import('mixpanel-browser').default

/**
 * The app's Mixpanel project, so the website and the app sit in one place and
 * a funnel can run from a blog visit to app usage. The token is public by
 * design (the app ships it too). Every website event carries platform=web.
 */
const MIXPANEL_TOKEN = 'b2dda4b0bbf735b905a338a7e40d508c'

/** Same-site path that next.config.ts forwards to Mixpanel, so ad blockers do not drop events. */
const PROXY_PATH = '/mp'

const WEB_ID_KEY = 'qrio_web_id'

let started = false
let client: Mixpanel | null = null
const queue: [string, Props | undefined][] = []

/**
 * A random id for this browser, also put in the Play Store referrer. The app
 * saves the raw referrer on first open (Supabase install_sources.referrer), so
 * a website visit can be joined to the install it led to.
 */
export function getWebId(): string {
  try {
    let id = localStorage.getItem(WEB_ID_KEY)
    if (!id) {
      id = Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => b.toString(16).padStart(2, '0')).join('')
      localStorage.setItem(WEB_ID_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

/**
 * Loads mixpanel-browser once the browser is idle, so it never competes with
 * the hero for bandwidth. Events fired before it is ready are queued.
 * Page views (with UTM tags) come from trackPageView, called on every route
 * change. localStorage only: no cookies are set.
 */
export function initAnalytics() {
  if (started || typeof window === 'undefined') return
  started = true

  const start = async () => {
    const { default: mixpanel } = await import('mixpanel-browser')
    mixpanel.init(MIXPANEL_TOKEN, {
      api_host: `${window.location.origin}${PROXY_PATH}`,
      // No trailing slashes, so the proxy path is not redirected first.
      api_routes: { track: 'track', engage: 'engage', groups: 'groups', record: 'record' },
      persistence: 'localStorage',
      // Page views are sent by trackPageView (after the super properties are set).
      track_pageview: false,
      ip: true,
    })
    mixpanel.register({ platform: 'web', web_id: getWebId() })
    client = mixpanel
    if (pendingPageView) mixpanel.track_pageview()
    for (const [event, props] of queue.splice(0)) mixpanel.track(event, props)
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => void start(), { timeout: 3000 })
  } else {
    setTimeout(() => void start(), 1500)
  }
}

let pendingPageView = false

/** Mixpanel's standard web page view (with UTM tags), for the current URL. */
export function trackPageView() {
  if (!started) return
  if (client) client.track_pageview()
  else pendingPageView = true
}

export function track(event: string, props?: Props) {
  if (!started) return
  if (client) client.track(event, props)
  else queue.push([event, props])
}
