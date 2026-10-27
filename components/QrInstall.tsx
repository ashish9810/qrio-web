/**
 * Desktop only: a QR code that opens qrioapp.in/get on the visitor's phone
 * (tagged utm_campaign=qr_desktop), since a computer cannot install the app.
 * Regenerate with: npx qrcode -t svg -e M -q 1 -o public/qr-install.svg "<url>"
 */
export default function QrInstall({ dark = false }: { dark?: boolean }) {
  return (
    <div className="mt-6 hidden items-center justify-center gap-3 md:flex">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/qr-install.svg" alt="QR code to get Qrio on your phone" width={84} height={84} className="rounded-lg bg-white p-1.5" />
      <p className={`max-w-[180px] text-left text-[13px] leading-snug ${dark ? 'text-[#b9b9cf]' : 'text-muted'}`}>
        On a computer? Scan with your Android phone to get the app.
      </p>
    </div>
  )
}
