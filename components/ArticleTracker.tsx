'use client'

import { useEffect } from 'react'
import { QrioEvent, track } from '@/lib/analytics'

const MILESTONES = [25, 50, 75] as const

/**
 * Reports an article view on mount and scroll-depth milestones as the reader
 * moves down the page. Renders nothing.
 */
export default function ArticleTracker({
  slug,
  category,
}: {
  slug: string
  category: string
}) {
  useEffect(() => {
    track(QrioEvent.articleView, { slug, category })
  }, [slug, category])

  useEffect(() => {
    const reached = new Set<number>()

    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return

      const percent = (window.scrollY / scrollable) * 100

      for (const milestone of MILESTONES) {
        if (percent >= milestone && !reached.has(milestone)) {
          reached.add(milestone)
          track(QrioEvent.articleRead, { slug, percent: milestone })
        }
      }

      if (reached.size === MILESTONES.length) {
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug])

  return null
}
