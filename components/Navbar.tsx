import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-card/92 backdrop-blur-md border-b border-line">
      <div className="max-w-[1080px] mx-auto px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="font-serif text-[26px] font-semibold text-ink no-underline tracking-tight">
          Qrio<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-7">
          <Link href="/" className="text-sm text-muted font-medium hover:text-ink transition-colors no-underline">
            Home
          </Link>
          <Link href="/about" className="text-sm text-muted font-medium hover:text-ink transition-colors no-underline">
            About
          </Link>
          <a
            href="https://play.google.com/store/apps/details?id=com.qrio.qrio"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ink text-white px-5 py-2.5 rounded-[10px] text-[13px] font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all inline-block no-underline"
          >
            Get the app
          </a>
        </div>
      </div>
    </nav>
  )
}
