'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { playStoreUrl } from '@/lib/content'
import { Events, getWebId, track } from '@/lib/analytics'
import { getUtm } from '@/lib/utm'
import { useEarlyAccess } from './EarlyAccessProvider'

const DISMISS_KEY = 'qrio_app_bar_dismissed'
const subscribeNoop = () => () => {}

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
    () => playStoreUrl('sticky', getUtm(), getWebId()),
    () => playStoreUrl('sticky'),
  )

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as InstallPrompt)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const onArticle = /^\/(blog|explainers)\/[^/]+/.test(pathname) && !pathname.startsWith('/explainers/topic/')
  if (platform !== 'android' || dismissedEarlier || closed || !onArticle) return null

  const dismiss = () => {
    setClosed(true)
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000))
    } catch {
      // Storage blocked: it simply shows again next page.
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-[720px] items-center gap-3">
        <Image src="/icons/icon-192.png" alt="" width={40} height={40} className="rounded-[10px]" />
        <p className="flex-1 text-[14px] leading-snug">
          <strong>Qrio app</strong>
          <br />
          <span className="text-muted">Stories like this as 1-minute videos. Free.</span>
        </p>
        <a
          href={href}
          className="btn btn-sm"
          onClick={(e) => {
            track(Events.ctaClick, { location: 'sticky', native_prompt: Boolean(installPrompt) })
            if (installPrompt) {
              e.preventDefault()
              void installPrompt.prompt()
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
