'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/**
 * A muted, looping sample clip that plays only while it is on screen.
 *
 * The poster is a normal lazy-loaded image underneath, and the video fades in
 * over it once it is actually playing, so there is never a black frame.
 * Playback only starts after the page has finished loading (so it cannot slow
 * the first paint) and never starts for visitors who prefer reduced motion or
 * have data saver on. Those visitors simply see the poster.
 */
export default function SampleVideo({
  src,
  poster,
  focus,
  sizes,
  fetchPriority = 'low',
  eager = false,
}: {
  src: string
  poster: string
  focus: string
  sizes: string
  fetchPriority?: 'auto' | 'low'
  /** Above the fold: load the poster straight away instead of lazily. */
  eager?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection
    if (reduceMotion || connection?.saveData) return

    let ready = false
    let visible = false
    let cancelled = false

    const sync = () => {
      if (!ready) return
      if (visible) {
        // Like a feed, restart from the beginning each time it comes into view.
        if (video.paused) {
          video.currentTime = 0
          video.play().catch(() => {})
        }
      } else if (!video.paused) {
        video.pause()
      }
    }

    // IntersectionObserver respects ancestor overflow clipping, so a clip
    // scrolled out of the phone screen counts as hidden.
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
        sync()
      },
      { threshold: 0.5 },
    )
    observer.observe(wrap)

    const start = () => {
      if (cancelled) return
      ready = true
      sync()
    }
    const afterLoad = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(start, { timeout: 2000 })
      } else {
        setTimeout(start, 800)
      }
    }
    if (document.readyState === 'complete') afterLoad()
    else window.addEventListener('load', afterLoad, { once: true })

    return () => {
      cancelled = true
      observer.disconnect()
      window.removeEventListener('load', afterLoad)
    }
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        quality={60}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={fetchPriority}
        className="object-cover"
        style={{ objectPosition: focus }}
      />
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaying(true)}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        style={{ objectPosition: focus, opacity: playing ? 1 : 0 }}
      />
    </div>
  )
}
