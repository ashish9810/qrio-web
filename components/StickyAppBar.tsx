'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { playStoreUrl } from '@/lib/content'
import { Events, getWebId, track } from '@/lib/analytics'
import { getUtm } from '@/lib/utm'
import { getAppUrl, isAndroid } from '@/lib/appLink'
import { useEarlyAccess } from './EarlyAccessProvider'

const DISMISS_KEY = 'qrio_app_bar_dismissed'
const subscribeNoop = () => () => {}

/**
 * The bar's line. An A/B test against "Get smarter in a minute a day. Free on
 * Android." ran 27 Oct to 11 Nov and was stopped: the bar is shown about 10
 * times a week, far short of the 300 shows per version a fair test needs.
 */
const LINE = 'Stories like this as 1-minute videos. Free.'

function readDismissed(): boolean {
  try {
    return Date.now() < Number(localStorage.getItem(DISMISS_KEY) ?? 0)
  } catch {
    return false
  }
}

type InstallPrompt = Event & { prompt: () => Promise<void> }

/**
 * A slim "Get the app" bar at the bottom of blog posts and stories, for
 * Android visitors only (they can install in one tap; most readers leave after
 * one page). Uses Chrome's native Play install prompt when it is offered (see
 * app/manifest.ts), otherwise links to Google Play with the install referrer.
 * Dismissing it hides it for 7 days.
 */
export default function StickyAppBar() {
  const pathname = usePathname()
  const { platform } = useEarlyAccess()
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null)
  // Hidden on the server and during hydration; afterwards, unless dismissed recently.
  const dismissedEarlier = useSyncExternalStore(subscribeNoop, readDismissed, () => true)
  const [closed, setClosed] = useState(false)

  const href = useSyncExternalStore(
    subscribeNoop,
    () => getAppUrl('sticky', getUtm(), getWebId(), isAndroid()),
    () => playStoreUrl('sticky'),
  )

  const onArticle = /^\/(blog|explainers)\/[^/]+/.test(pathname) && !pathname.startsWith('/explainers/topic/')
  const visible = platform === 'android' && !dismissedEarlier && !closed && onArticle

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as InstallPrompt)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  useEffect(() => {
    if (visible) track(Events.stickyShown)
  }, [visible, pathname])

  if (!visible) return null

  const dismiss = () => {
    setClosed(true)
    track(Events.stickyDismissed)
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000))
    } catch {
      // Storage blocked: it simply shows again next page.
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-[720px] items-center gap-3">
        <Image src="/icons/icon-192.png" alt="Qrio app icon" width={40} height={40} className="rounded-[10px]" />
        <p className="flex-1 text-[14px] leading-snug">
          <strong>Qrio app</strong>
          <br />
          <span className="text-muted">{LINE}</span>
        </p>
        <a
          href={href}
          className="btn btn-sm"
          onClick={(e) => {
            track(Events.ctaClick, { location: 'sticky', native_prompt: Boolean(installPrompt) })
            if (installPrompt) {
              e.preventDefault()
              void installPrompt.prompt().then(async () => {
                const choice = await (installPrompt as InstallPrompt & { userChoice?: Promise<{ outcome: string }> }).userChoice
                if (choice) track(Events.installPrompt, { outcome: choice.outcome })
              })
            }
          }}
        >
          Get app
        </a>
        <button type="button" onClick={dismiss} aria-label="Close" className="px-1 text-xl leading-none text-muted">
          ×
        </button>
      </div>
    </div>
  )
}
