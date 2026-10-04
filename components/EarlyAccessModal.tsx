'use client'

import { useEffect, useRef, useState } from 'react'
import { ERRORS, MODAL } from '@/lib/content'
import { Events, track } from '@/lib/analytics'
import { getUtm } from '@/lib/utm'
import { validateWaitlist, type Platform } from '@/lib/validation'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'

export default function EarlyAccessModal({
  platform,
  iphoneComingSoon,
  onClose,
}: {
  platform: Platform
  iphoneComingSoon: boolean
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  // Focus the email field on open and stop the page behind from scrolling.
  useEffect(() => {
    emailRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Escape closes. Tab is trapped inside the dialog.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (sending) return

    const result = validateWaitlist({ email, whatsapp })
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError('')
    setSending(true)

    const utm = getUtm()
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          whatsapp,
          company,
          platform,
          source: utm.source,
          campaign: utm.campaign,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? ERRORS.generic)
        setSending(false)
        return
      }
      track(Events.waitlistSubmit, {
        platform,
        has_email: Boolean(result.value.email),
        has_whatsapp: Boolean(result.value.whatsapp),
      })
      setDone(true)
    } catch {
      setError(ERRORS.generic)
      setSending(false)
    }
  }

  const title = iphoneComingSoon ? MODAL.titleIphone : MODAL.title

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={MODAL.close}
          className="absolute top-3.5 right-4 cursor-pointer text-2xl leading-none text-muted"
        >
          &times;
        </button>

        {done ? (
          <div className="py-2.5 text-center">
            <div
              className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-[26px] text-accent"
              aria-hidden="true"
            >
              &#10003;
            </div>
            <h3
              id="modal-title"
              className="font-serif text-[28px] leading-[1.15] font-medium"
            >
              {MODAL.successTitle}
            </h3>
            <p className="mt-1.5 text-muted">{MODAL.successBody}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <h3
              id="modal-title"
              className="mb-1.5 font-serif text-[28px] leading-[1.15] font-medium"
            >
              {title}
            </h3>
            <p className="mb-[22px] text-[15px] text-muted">{MODAL.sub}</p>

            <label className="mb-3 grid gap-1.5 text-sm font-medium">
              {MODAL.email}
              <input
                ref={emailRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                className="field"
                placeholder={MODAL.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <div className="mt-0.5 mb-2.5 text-center text-xs tracking-[0.08em] text-muted uppercase">
              {MODAL.or}
            </div>

            <label className="mb-3 grid gap-1.5 text-sm font-medium">
              {MODAL.whatsapp}
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="field"
                placeholder={MODAL.whatsappPlaceholder}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </label>

            <div className="hp" aria-hidden="true">
              <label>
                Company
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </label>
            </div>

            <div className="form-error my-1 mb-2.5" role="alert">
              {error}
            </div>
            <button type="submit" className="btn w-full" disabled={sending}>
              {sending ? MODAL.sending : MODAL.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
