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
          <div className="relative group">
            <span className="bg-ink text-white px-5 py-2.5 rounded-[10px] text-[13px] font-semibold cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all inline-block">
              Get the app
            </span>
            <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 bg-ink text-white text-xs font-medium px-3.5 py-2 rounded-lg whitespace-nowrap transition-opacity z-50">
              Coming soon to Play Store &#127881;
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-ink" />
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}
