import Link from 'next/link'
import { CONTACT_EMAIL, FOOTER, SOCIAL_LINKS } from '@/lib/content'

export default function Footer() {
  const social = [
    { label: 'Instagram', href: SOCIAL_LINKS.instagram },
    { label: 'YouTube', href: SOCIAL_LINKS.youtube },
    { label: 'X', href: SOCIAL_LINKS.x },
  ].filter((link) => link.href)

  return (
    <footer className="border-t border-line py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-between gap-5 px-5">
        <div>
          <strong className="text-ink">Qrio.</strong> {FOOTER.tagline}
        </div>
        <ul className="flex flex-wrap gap-5">
          {social.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
              Contact
            </a>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
