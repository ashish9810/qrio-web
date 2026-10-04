'use client'

import { CTA, PLAY_STORE_URL } from '@/lib/content'
import { Events, track, type CtaLocation } from '@/lib/analytics'
import { useEarlyAccess } from './EarlyAccessProvider'

/**
 * The one call to action used everywhere. Opens the early-access modal, or,
 * once APP_LIVE is true, links to Google Play (iPhone visitors keep the modal).
 */
export default function CtaButton({
  location,
  small = false,
}: {
  location: CtaLocation
  small?: boolean
}) {
  const { showPlayStore, openModal } = useEarlyAccess()
  const className = `btn${small ? ' btn-sm' : ''}`

  if (showPlayStore) {
    return (
      <a
        href={PLAY_STORE_URL}
        className={className}
        onClick={() => track(Events.ctaClick, { location })}
      >
        {CTA.playStore}
      </a>
    )
  }

  return (
    <button type="button" className={className} onClick={(e) => openModal(location, e.currentTarget)}>
      {CTA.earlyAccess}
    </button>
  )
}
