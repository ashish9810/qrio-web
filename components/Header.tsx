import Link from 'next/link'
import CtaButton from './CtaButton'

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5">
        <Link
          href="/"
          className="font-serif text-[26px] font-semibold tracking-[-0.03em]"
        >
          Qrio
        </Link>
        <nav
          aria-label="Main"
          className="flex items-center gap-[22px] text-[15px] text-muted"
        >
          <Link href="/#how" className="hidden hover:text-ink md:inline">
            How it works
          </Link>
          <Link href="/#creators" className="hover:text-ink">
            For creators
          </Link>
          <CtaButton location="header" small />
        </nav>
      </div>
    </header>
  )
}
