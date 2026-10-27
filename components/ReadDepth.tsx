'use client'

import { useEffect } from 'react'
import { Events, track } from '@/lib/analytics'

/**
 * Sends "Web Scroll Depth" once at 50% and once at 90% of an article, with the
 * page type and post format, so the weekly check can see which kinds of posts
 * are actually read (not just opened).
 */
export default function ReadDepth({ pageType, format }: { pageType: 'blog' | 'story'; format?: string }) {
  useEffect(() => {
    const sent = new Set<number>()
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = (window.scrollY / max) * 100
      for (const depth of [50, 90]) {
        if (pct >= depth && !sent.has(depth)) {
          sent.add(depth)
          track(Events.scrollDepth, { depth, page_type: pageType, ...(format ? { post_format: format } : {}) })
        }
      }
      if (sent.size === 2) window.removeEventListener('scroll', onScroll)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pageType, format])
  return null
}
