'use client'

import { useEffect, useRef, useState } from 'react'
import { SEND_TO_PHONE, WHATSAPP_COMMUNITY_URL, playStoreUrl } from '@/lib/content'
import { Events, getWebId, track, type CtaLocation } from '@/lib/analytics'
import { getAppUrl, phoneUrl } from '@/lib/appLink'
import type { DeviceResult } from '@/lib/device'
import { getUtm } from '@/lib/utm'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Builds the QR as one SVG path. The library is fetched only when the panel opens. */
async function makeQrPath(text: string): Promise<{ d: string; size: number }> {
  const { default: qrcode } = await import('qrcode-generator')
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  const n = qr.getModuleCount()
  let d = ''
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`
    }
  }
  return { d, size: n }
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
    </svg>
  )
}

/**
 * "Send to my phone": what a download button opens when the visitor is not on
 * Android (Android always goes straight to Google Play, never here).
 *
 * desktop: QR code to /phone + WhatsApp community + a small Play web link.
 * ios:     WhatsApp community + the iPhone waitlist.
 * unknown: Google Play first, WhatsApp community second.
 */
export default function SendToPhonePanel({
  device,
  location,
  onClose,
  onWaitlist,
}: {
  device: DeviceResult
  location: CtaLocation
  onClose: () => void
  onWaitlist: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const kind = device.device === 'desktop' ? 'desktop' : device.device === 'ios' ? 'ios' : 'unknown'
  const where = `${kind}_panel`
  const [qrUrl] = useState(() => phoneUrl(location, getUtm(), getWebId()))
  const [qr, setQr] = useState<{ d: string; size: number } | null>(null)
  const [qrFailed, setQrFailed] = useState(false)

  useEffect(() => {
    track(Events.sendToPhoneOpen, { location, device_class: device.device, detect_method: device.method })
  }, [location, device])

  useEffect(() => {
    if (kind !== 'desktop') return
    let live = true
    makeQrPath(qrUrl).then(
      (r) => {
        if (!live) return
        setQr(r)
        track(Events.qrShown, { location, qr_kind: 'dynamic' })
      },
      () => {
        if (!live) return
        setQrFailed(true)
        track(Events.qrShown, { location, qr_kind: 'static' })
      },
    )
    return () => {
      live = false
    }
  }, [kind, qrUrl, location])

  // Focus the dialog, stop the page behind from scrolling.
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
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

  const whatsapp = (
    <a
      href={WHATSAPP_COMMUNITY_URL}
      target="_blank"
      rel="noopener"
      data-testid="whatsapp-link"
      onClick={() => track(Events.whatsappClick, { where, location })}
      className="btn w-full"
      style={{ background: '#128C4A' }}
    >
      <WhatsAppIcon />
      {SEND_TO_PHONE.whatsapp}
    </a>
  )

  const title = kind === 'ios' ? SEND_TO_PHONE.titleIos : kind === 'unknown' ? SEND_TO_PHONE.titleUnknown : SEND_TO_PHONE.title
  const sub = kind === 'ios' ? SEND_TO_PHONE.subIos : kind === 'unknown' ? SEND_TO_PHONE.subUnknown : SEND_TO_PHONE.sub

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
        style={kind === 'desktop' ? { maxWidth: 620 } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-title"
        data-panel={kind}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={SEND_TO_PHONE.close}
          className="absolute top-3.5 right-4 cursor-pointer text-2xl leading-none text-muted"
        >
          &times;
        </button>
        <h3 id="send-title" className="mb-1.5 pr-6 font-serif text-[28px] leading-[1.15] font-medium">
          {title}
        </h3>
        <p className="mb-6 text-[15px] text-muted">{sub}</p>

        {kind === 'desktop' && (
          <>
            <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
              <div className="text-center">
                <div
                  className="mx-auto grid h-[184px] w-[184px] place-items-center rounded-2xl border border-line bg-white p-2"
                  data-qr-url={qrUrl}
                >
                  {qr ? (
                    <svg
                      viewBox={`-2 -2 ${qr.size + 4} ${qr.size + 4}`}
                      width="168"
                      height="168"
                      role="img"
                      aria-label="QR code to get Qrio on your phone"
                      shapeRendering="crispEdges"
                    >
                      <rect x="-2" y="-2" width={qr.size + 4} height={qr.size + 4} fill="#fff" />
                      <path d={qr.d} fill="#141414" />
                    </svg>
                  ) : qrFailed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/qr-install.svg" alt="QR code to get Qrio on your phone" width={168} height={168} />
                  ) : (
                    <span className="text-[13px] text-muted">...</span>
                  )}
                </div>
                <p className="mt-2.5 text-sm font-medium">{SEND_TO_PHONE.scan}</p>
                <p className="text-xs text-muted">{SEND_TO_PHONE.scanNote}</p>
              </div>
              <div>
                {whatsapp}
                <p className="mt-2.5 text-center text-[13px] text-muted">{SEND_TO_PHONE.whatsappNote}</p>
              </div>
            </div>
            <p className="mt-6 text-center">
              <a
                href={playStoreUrl(location, getUtm(), getWebId())}
                target="_blank"
                rel="noopener"
                onClick={() => track(Events.playWebClick, { location, where })}
                className="text-[13px] text-muted underline hover:text-ink"
              >
                {SEND_TO_PHONE.playWeb}
              </a>
            </p>
          </>
        )}

        {kind === 'ios' && (
          <>
            {whatsapp}
            <p className="mt-2.5 mb-5 text-center text-[13px] text-muted">{SEND_TO_PHONE.whatsappNoteIos}</p>
            <button type="button" onClick={onWaitlist} className="w-full cursor-pointer text-center text-[15px] text-accent underline">
              {SEND_TO_PHONE.waitlist}
            </button>
          </>
        )}

        {kind === 'unknown' && (
          <div className="grid gap-3">
            <a
              href={getAppUrl(location, getUtm(), getWebId(), true)}
              onClick={() => track(Events.playWebClick, { location, where })}
              className="btn w-full"
            >
              {SEND_TO_PHONE.play}
            </a>
            {whatsapp}
          </div>
        )}
      </div>
    </div>
  )
}
