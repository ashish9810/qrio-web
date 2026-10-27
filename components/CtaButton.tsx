'use client'

import { useSyncExternalStore } from 'react'
import { CTA, playStoreUrl } from '@/lib/content'
import { Events, getWebId, track, type CtaLocation } from '@/lib/analytics'
import { getUtm } from '@/lib/utm'
import { getAppUrl, isAndroid } from '@/lib/appLink'
import { useEarlyAccess } from './EarlyAccessProvider'

const subscribeNoop = () => () => {}

/**
 * The one call to action used everywhere. Opens the early-access modal, or,
 * once APP_LIVE is true, links to Google Play (iPhone visitors keep the modal).
 * The Play link carries an install referrer so Play Console can attribute
 * installs to this site, and to the campaign the visitor arrived from.
 */
export default function CtaButton({
  location,
  small = false,
}: {
  location: CtaLocation
  small?: boolean
}) {
  const { platform, showPlayStore, openModal } = useEarlyAccess()
  const className = `btn${small ? ' btn-sm' : ''}`

  // The plain link on the server, the campaign-tagged link once in the browser.
  const href = useSyncExternalStore(
    subscribeNoop,
    () => getAppUrl(location, getUtm(), getWebId(), isAndroid()),
    () => playStoreUrl(location),
  )

  if (showPlayStore) {
    return (
      <a href={href} className={className} onClick={() => track(Events.ctaClick, { location, platform_detected: platform })}>
        {CTA.playStore}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        track(Events.ctaClick, { location, platform_detected: platform })
        openModal(location, e.currentTarget)
      }}
    >
      {CTA.earlyAccess}
    </button>
  )
}
