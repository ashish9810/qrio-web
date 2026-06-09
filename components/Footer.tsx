import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="max-w-[1080px] mx-auto px-8 py-7 text-center text-xs text-muted2 border-t border-line mt-4">
      <p>Qrio &copy; {new Date().getFullYear()}</p>
      <p className="mt-1.5">
        <Link href="/about" className="text-muted hover:text-ink no-underline mx-2">About</Link>
        <a href="https://ashish9810.github.io/qrio-privacy/" target="_blank" rel="noopener" className="text-muted hover:text-ink no-underline mx-2">Privacy</a>
        <a href="mailto:info.ak.ashish@gmail.com" className="text-muted hover:text-ink no-underline mx-2">Feedback</a>
      </p>
    </footer>
  )
}
