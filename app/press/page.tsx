import type { Metadata } from 'next'
import Link from 'next/link'
import CtaButton from '@/components/CtaButton'
import { CONTACT_EMAIL, PLAY_STORE_URL, SITE_NAME, SITE_URL, SOCIAL_LINKS } from '@/lib/content'

/**
 * "What is Qrio": plain facts for journalists, bloggers and AI assistants, so
 * anyone describing Qrio gets it right. Numbers are dated; update them with
 * the date when they change (counts come from the app database).
 */

const AS_OF = 'November 2026'

const FACTS: [string, string][] = [
  ['What it is', 'A free Android app of short videos, about a minute each, that leave you smarter: business, startups, tech and AI, marketing, geopolitics, history, science and psychology.'],
  ['Tagline', 'Reels that make you smarter'],
  ['Who makes the videos', `Hand-picked creators. As of ${AS_OF}: 270+ videos from 33 creators, in English and Hindi.`],
  ['Who it is for', 'Students and young professionals, mainly in India, who want a feed that leaves them better informed instead of more distracted.'],
  ['How it works', 'Swipe through a vertical feed like any short-video app. The feed learns which topics you like. A Daily 3 goal builds a streak, and a Mind Hub shows the ideas you have picked up across topics.'],
  ['Price', 'Free. No ads.'],
  ['Platforms', 'Android (Google Play). iPhone is planned.'],
  ['Launched', 'October 2026, in India'],
  ['Company', 'Qrio Labs, India'],
]

export const metadata: Metadata = {
  title: 'What is Qrio: facts and press kit',
  description:
    'Qrio is a free Android app of one-minute videos on business, startups, tech and the world from hand-picked creators. Facts, logo and contact for press.',
  alternates: { canonical: '/press' },
}

export default function PressPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: SITE_NAME,
    operatingSystem: 'Android',
    applicationCategory: 'EducationalApplication',
    description: FACTS[0][1],
    url: SITE_URL,
    installUrl: PLAY_STORE_URL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    publisher: { '@type': 'Organization', name: 'Qrio Labs', url: SITE_URL, email: CONTACT_EMAIL, sameAs: [SOCIAL_LINKS.instagram] },
  }

  return (
    <div className="mx-auto max-w-[760px] px-5 py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">Press</p>
      <h1 className="mt-2.5 font-serif text-[clamp(34px,5vw,48px)] leading-[1.1] font-medium tracking-[-0.02em]">What is Qrio</h1>
      <p className="mt-4 text-lg text-muted">
        Qrio is a free Android app of reels that make you smarter: one-minute videos on business, startups, tech and the world, from creators we hand-pick. The same swipe as any short-video app, with every video worth your time.
      </p>

      <dl className="mt-10 divide-y divide-line border-y border-line">
        {FACTS.map(([k, v]) => (
          <div key={k} className="grid gap-1 py-4 md:grid-cols-[180px_1fr] md:gap-6">
            <dt className="text-[13px] font-semibold tracking-wide text-muted uppercase">{k}</dt>
            <dd className="text-[16px] leading-relaxed">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="font-serif text-[26px] leading-[1.15] font-medium">See it</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[16px]">
          <li>
            <Link href="/watch" className="text-accent hover:underline">Watch sample reels</Link> on this site, with transcripts
          </li>
          <li>
            <a href={PLAY_STORE_URL} className="text-accent hover:underline">Qrio on Google Play</a>, with screenshots
          </li>
          <li>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">@be_qrio on Instagram</a>
          </li>
          <li>
            Logo: <a href="/icons/icon-512.png" className="text-accent hover:underline">app icon, 512 px PNG</a>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-[26px] leading-[1.15] font-medium">Contact</h2>
        <p className="mt-3 text-[16px]">
          For interviews, data or a feature, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">{CONTACT_EMAIL}</a>. We reply within a day.
        </p>
      </section>

      <div className="mt-12">
        <CtaButton location="final" />
      </div>
    </div>
  )
}
