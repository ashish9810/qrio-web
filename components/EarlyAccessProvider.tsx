'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { APP_LIVE } from '@/lib/content'
import { Events, initAnalytics, track, trackPageView, type CtaLocation } from '@/lib/analytics'
import { captureUtm } from '@/lib/utm'
import type { Platform } from '@/lib/validation'
import { detectDevice, type DeviceResult } from '@/lib/device'
import dynamic from 'next/dynamic'

// Loaded only when someone opens them, so their code is not on the homepage's critical path.
const EarlyAccessModal = dynamic(() => import('./EarlyAccessModal'))
const SendToPhonePanel = dynamic(() => import('./SendToPhonePanel'))

type EarlyAccessContextValue = {
  platform: Platform
  /** True when the Play Store link should replace the early-access button. */
  showPlayStore: boolean
  /** Pass the clicked element so focus can return to it when the modal closes. */
  openModal: (location: CtaLocation, opener?: HTMLElement | null) => void
  /** android / ios / desktop / unknown (lib/device.ts). 'unknown' on the server and during hydration. */
  device: DeviceResult
  /** The "send to my phone" panel, for every device except Android. */
  openSendToPhone: (location: CtaLocation, opener?: HTMLElement | null) => void
}

const EarlyAccessContext = createContext<EarlyAccessContextValue | null>(null)

export function useEarlyAccess() {
  const ctx = useContext(EarlyAccessContext)
  if (!ctx) throw new Error('useEarlyAccess must be used inside EarlyAccessProvider')
  return ctx
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent
  if (/Android/i.test(ua)) return 'android'
  // iPadOS reports itself as a Mac, so also check for touch support.
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  if (/iPhone|iPad|iPod/i.test(ua) || iPadOs) return 'ios'
  return 'other'
}

const subscribeNoop = () => () => {}

const SERVER_DEVICE: DeviceResult = { device: 'unknown', method: 'none' }
let clientDevice: DeviceResult | null = null
// Cached so useSyncExternalStore gets the same object on every read.
const readDevice = () => (clientDevice ??= detectDevice())

export default function EarlyAccessProvider({ children }: { children: React.ReactNode }) {
  // 'other' on the server and during hydration, the real platform afterwards.
  const platform = useSyncExternalStore<Platform>(
    subscribeNoop,
    detectPlatform,
    () => 'other',
  )
  const device = useSyncExternalStore<DeviceResult>(subscribeNoop, readDevice, () => SERVER_DEVICE)
  const [open, setOpen] = useState(false)
  const [sendTo, setSendTo] = useState<CtaLocation | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    captureUtm()
    initAnalytics()
    // From the /phone page on an iPhone: "Tell me when iPhone is ready".
    if (new URLSearchParams(window.location.search).get('waitlist') === 'iphone') {
      track(Events.modalOpen, { location: 'phone_page' })
      // After the first paint, so the page shows behind the form.
      setTimeout(() => setOpen(true), 0)
    }
  }, [])

  // Clicks between articles (the related cards and in-text links) and out to
  // sources, so we can see whether cross-linking keeps readers on the site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a')
      const href = link?.getAttribute('href')
      if (!href) return
      const from = window.location.pathname
      if (/^\/(blog|explainers)\/[^/]+/.test(href) && !href.startsWith('/explainers/topic/')) {
        if (/^\/(blog|explainers)\/[^/]+/.test(from)) track(Events.internalClick, { from, to: href })
      } else if (/^https?:\/\//.test(href)) {
        const host = new URL(href).hostname
        if (!/qrioapp\.in$|play\.google\.com$/.test(host)) track(Events.outboundClick, { from, host })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // One page view per route, including client-side navigation.
  const pathname = usePathname()
  useEffect(() => {
    trackPageView()
  }, [pathname])

  const openModal = useCallback((location: CtaLocation, opener?: HTMLElement | null) => {
    openerRef.current = opener ?? (document.activeElement as HTMLElement | null)
    track(Events.modalOpen, { location })
    setOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setOpen(false)
    // Hand focus back to the button that opened the modal.
    openerRef.current?.focus()
  }, [])

  const openSendToPhone = useCallback((location: CtaLocation, opener?: HTMLElement | null) => {
    openerRef.current = opener ?? (document.activeElement as HTMLElement | null)
    setSendTo(location)
  }, [])

  const closeSendToPhone = useCallback(() => {
    setSendTo(null)
    openerRef.current?.focus()
  }, [])

  // iPhone panel -> waitlist form.
  const sendToWaitlist = useCallback(() => {
    if (sendTo) track(Events.modalOpen, { location: sendTo })
    setSendTo(null)
    setOpen(true)
  }, [sendTo])

  const value = useMemo(
    () => ({
      platform,
      showPlayStore: APP_LIVE && platform !== 'ios',
      openModal,
      device,
      openSendToPhone,
    }),
    [platform, openModal, device, openSendToPhone],
  )

  return (
    <EarlyAccessContext.Provider value={value}>
      {children}
      {open && (
        <EarlyAccessModal
          platform={platform}
          iphoneComingSoon={APP_LIVE && (platform === 'ios' || device.device === 'ios')}
          onClose={closeModal}
        />
      )}
      {sendTo && (
        <SendToPhonePanel device={device} location={sendTo} onClose={closeSendToPhone} onWaitlist={sendToWaitlist} />
      )}
    </EarlyAccessContext.Provider>
  )
}
