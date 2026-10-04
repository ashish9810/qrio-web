'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Fade and slide in when scrolled into view. Content is fully visible on the
 * server and with JS off; only elements below the fold are hidden after mount,
 * so nothing flashes. Reduced-motion users never see the effect.
 */
export default function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    setHidden(true)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHidden(false)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${hidden ? 'reveal-hidden' : ''} ${className}`}>
      {children}
    </div>
  )
}
