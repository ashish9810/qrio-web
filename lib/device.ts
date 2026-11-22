/**
 * Which kind of device a visitor is on, so a download button can do the right
 * thing (see Qrio-Website-Install-Plan.md, tables A3 and A4).
 *
 * The rule that matters most: anything that looks like Android goes straight to
 * Google Play. Only a visitor we are sure is on a computer gets the
 * "send to my phone" panel. When unsure, show Play first.
 *
 * No React here, so both functions can be checked against a list of real
 * user agents.
 */

export type DeviceClass = 'android' | 'ios' | 'desktop' | 'unknown'
export type DetectMethod = 'uach' | 'ua' | 'touch' | 'none'

export type DeviceSignals = {
  /** navigator.userAgentData.platform (Chromium browsers only). */
  uaPlatform?: string | null
  /** navigator.userAgentData.mobile (Chromium browsers only). */
  uaMobile?: boolean | null
  ua?: string | null
  maxTouchPoints?: number | null
  /** matchMedia('(pointer: coarse)').matches */
  coarse?: boolean | null
}

export type DeviceResult = { device: DeviceClass; method: DetectMethod }

/** Table A3: the browser decision, first match wins. */
export function classifyDevice(s: DeviceSignals): DeviceResult {
  const ua = s.ua ?? ''
  const platform = s.uaPlatform ?? ''
  const touch = s.maxTouchPoints ?? 0
  const isMac = /Macintosh/i.test(ua) || platform === 'macOS'
  const isLinux = /X11; Linux|Linux x86_64|Linux i686/i.test(ua) || platform === 'Linux'

  // 1. Android, from either signal.
  if (platform === 'Android') return { device: 'android', method: 'uach' }
  if (/Android/i.test(ua)) return { device: 'android', method: 'ua' }
  // 2. iPhone, iPad, iPod.
  if (/iPhone|iPad|iPod/i.test(ua)) return { device: 'ios', method: 'ua' }
  // 3. An iPad in desktop mode says Mac but has touch (real Macs report 0).
  if (isMac && touch > 1) return { device: 'ios', method: 'touch' }
  // 4. Chromebooks can install Android apps from Play.
  if (platform === 'Chrome OS' || /CrOS/.test(ua)) return { device: 'unknown', method: platform ? 'uach' : 'ua' }
  // 5. Windows (touch laptops are still computers).
  if (platform === 'Windows') return { device: 'desktop', method: 'uach' }
  if (/Windows NT/i.test(ua)) return { device: 'desktop', method: 'ua' }
  // 6. Mac without touch.
  if (isMac) return { device: 'desktop', method: platform === 'macOS' ? 'uach' : 'ua' }
  // 7. Linux only when there is no touch at all (Android "desktop site" sends a Linux UA).
  if (isLinux && touch === 0 && !s.coarse && s.uaMobile !== true) return { device: 'desktop', method: 'touch' }
  // 8 and 9. Linux with touch, mobile hint, or anything else.
  return { device: 'unknown', method: isLinux || s.uaMobile ? 'touch' : 'none' }
}

/** Reads the signals from the current browser. Call only in the browser. */
export function detectDevice(): DeviceResult {
  try {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string; mobile?: boolean } }
    return classifyDevice({
      uaPlatform: nav.userAgentData?.platform,
      uaMobile: nav.userAgentData?.mobile,
      ua: nav.userAgent,
      maxTouchPoints: nav.maxTouchPoints,
      coarse: typeof matchMedia === 'function' ? matchMedia('(pointer: coarse)').matches : false,
    })
  } catch {
    return { device: 'unknown', method: 'none' }
  }
}

/** Link-preview bots (WhatsApp, LinkedIn, X...), shared by /get and /phone. */
export const PREVIEW_BOTS =
  /bot|crawler|spider|facebookexternalhit|facebot|whatsapp|telegram|slack|discord|linkedin|pinterest|skypeuripreview|vkshare|embedly|quora link|preview|iframely/i

export type PhoneDecision = 'bot' | 'android' | 'ios' | 'maybe_ipad' | 'unsure'

/** Table A4: the /phone page decision, from request headers only. */
export function classifyRequest(headers: Headers): PhoneDecision {
  const ua = headers.get('user-agent') ?? ''
  const platform = (headers.get('sec-ch-ua-platform') ?? '').replace(/"/g, '')
  if (PREVIEW_BOTS.test(ua)) return 'bot'
  if (platform === 'Android' || /Android/i.test(ua)) return 'android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  // Safari on an iPad asks for the desktop site and says Macintosh. Chromium on
  // a real Mac sends the platform hint, so only hint-less Macs are in doubt.
  if (/Macintosh/i.test(ua) && !platform) return 'maybe_ipad'
  return 'unsure'
}
