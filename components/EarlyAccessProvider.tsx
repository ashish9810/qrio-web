'use client'

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
import { Events, initAnalytics, track, type CtaLocation } from '@/lib/analytics'
import { captureUtm } from '@/lib/utm'
import type { Platform } from '@/lib/validation'
import EarlyAccessModal from './EarlyAccessModal'

type EarlyAccessContextValue = {
  platform: Platform
  /** True when the Play Store link should replace the early-access button. */
  showPlayStore: boolean
  /** Pass the clicked element so focus can return to it when the modal closes. */
  openModal: (location: CtaLocation, opener?: HTMLElement | null) => void
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

export default function EarlyAccessProvider({
  posthogKey,
  posthogHost,
  children,
}: {
  posthogKey?: string
  posthogHost?: string
  children: React.ReactNode
}) {
  // 'other' on the server and during hydration, the real platform afterwards.
  const platform = useSyncExternalStore<Platform>(
    subscribeNoop,
    detectPlatform,
    () => 'other',
  )
  const [open, setOpen] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    captureUtm()
    initAnalytics(posthogKey, posthogHost)
    track(Events.pageView, { path: window.location.pathname })
  }, [posthogKey, posthogHost])

  const openModal = useCallback((location: CtaLocation, opener?: HTMLElement | null) => {
    openerRef.current = opener ?? (document.activeElement as HTMLElement | null)
    track(Events.ctaClick, { location })
    track(Events.modalOpen, { location })
    setOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setOpen(false)
    // Hand focus back to the button that opened the modal.
    openerRef.current?.focus()
  }, [])

  const value = useMemo(
    () => ({
      platform,
      showPlayStore: APP_LIVE && platform !== 'ios',
      openModal,
    }),
    [platform, openModal],
  )

  return (
    <EarlyAccessContext.Provider value={value}>
      {children}
      {open && (
        <EarlyAccessModal
          platform={platform}
          iphoneComingSoon={APP_LIVE && platform === 'ios'}
          onClose={closeModal}
        />
      )}
    </EarlyAccessContext.Provider>
  )
}
