'use client'

import { useSyncExternalStore } from 'react'
import { APP_LIVE, CTA, playStoreUrl } from '@/lib/content'
import { Events, getWebId, track, type CtaLocation } from '@/lib/analytics'
import { getUtm } from '@/lib/utm'
import { getAppUrl } from '@/lib/appLink'
import { detectDevice } from '@/lib/device'
import { useEarlyAccess } from './EarlyAccessProvider'

const subscribeNoop = () => () => {}

/**
 * The one call to action used everywhere. Android goes straight to /get (opens
 * the app if installed, else Google Play), with an install referrer so Play
 * Console can attribute installs to this site and the campaign the visitor
 * arrived from. Every other device opens the "send to my phone" panel
 * (components/SendToPhonePanel.tsx): QR + WhatsApp on a computer, WhatsApp +
 * waitlist on iPhone, Play + WhatsApp when unsure. Before hydration (and
 * without JavaScript) it is the plain Play link, as before.
 */
export default function CtaButton({
  location,
  small = false,
}: {
  location: CtaLocation
  small?: boolean
}) {
  const { platform, showPlayStore, openModal, device, openSendToPhone } = useEarlyAccess()
  const className = `btn${small ? ' btn-sm' : ''}`

  // The plain link on the server, the campaign-tagged link once in the browser.
  const href = useSyncExternalStore(
    subscribeNoop,
    () => getAppUrl(location, getUtm(), getWebId(), detectDevice().device === 'android'),
    () => playStoreUrl(location),
  )

  const clickProps = { location, platform_detected: platform, device_class: device.device, detect_method: device.method }

  if (showPlayStore) {
    return (
      <a
        href={href}
        className={className}
        onClick={(e) => {
          // Read the device at click time, so a click during hydration is still routed right.
          const now = detectDevice()
          track(Events.ctaClick, { ...clickProps, device_class: now.device, detect_method: now.method })
          // Android: follow the link to /get. Never the panel.
          if (now.device === 'android') return
          e.preventDefault()
          openSendToPhone(location, e.currentTarget)
        }}
      >
        {CTA.playStore}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        track(Events.ctaClick, clickProps)
        if (APP_LIVE) openSendToPhone(location, e.currentTarget)
        else openModal(location, e.currentTarget)
      }}
    >
      {CTA.earlyAccess}
    </button>
  )
}
