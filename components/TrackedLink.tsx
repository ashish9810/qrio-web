'use client'

import Link from 'next/link'
import { track, type QrioEventName } from '@/lib/analytics'

type Props = {
  href: string
  event: QrioEventName
  params?: Record<string, string | number>
  className?: string
  children: React.ReactNode
  /** Open in a new tab. Defaults to true for off-site links. */
  newTab?: boolean
}

/**
 * A link that reports a GA event on click. Renders next/link for internal
 * routes so client-side navigation still works, and a plain anchor otherwise.
 */
export default function TrackedLink({
  href,
  event,
  params,
  className,
  children,
  newTab,
}: Props) {
  const isExternal = /^https?:\/\//.test(href)
  const openInNewTab = newTab ?? isExternal
  const onClick = () => track(event, params)

  if (isExternal) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={className}
        {...(openInNewTab
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  )
}
