import type { Metadata } from 'next'
import Link from 'next/link'
import ReelCard from '@/components/ReelCard'
import { activeTopics, getReels, reelsIn } from '@/lib/watch'
import { SITE_URL } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Watch: 1-minute reels that make you smarter',
  description:
    'Short videos on business, startups, geopolitics, tech and history from hand-picked creators. Watch a preview here and the full reel free on Qrio.',
  alternates: { canonical: '/watch' },
}

export default function WatchHub() {
  const reels = getReels()
  const topics = activeTopics()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Qrio reels',
    url: `${SITE_URL}/watch`,
    hasPart: reels.slice(0, 30).map((r) => ({ '@type': 'VideoObject', name: r.title, url: `${SITE_URL}/watch/${r.slug}` })),
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">Watch</p>
      <h1 className="mt-2.5 max-w-[760px] font-serif text-[clamp(34px,5vw,52px)] leading-[1.1] font-medium tracking-[-0.02em]">
        Reels that make you smarter
      </h1>
      <p className="mt-4 max-w-[640px] text-lg text-muted">
        One-minute videos on business, startups, the world and how things work, from creators we hand-pick. Watch the start here and the rest free in the Qrio app.
      </p>

      <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Browse by topic">
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/watch/topic/${t.slug}`}
              className="inline-block rounded-full border border-ink px-[18px] py-2 text-[15px] font-medium hover:bg-ink hover:text-white"
            >
              {t.label} <span className="text-muted">({reelsIn(t).length})</span>
            </Link>
          </li>
        ))}
      </ul>

      {topics.map((t) => (
        <section key={t.slug} className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-serif text-[28px] leading-[1.15] font-medium">{t.label}</h2>
            <Link href={`/watch/topic/${t.slug}`} className="text-[15px] text-accent hover:underline">
              All {reelsIn(t).length} reels
            </Link>
          </div>
          <p className="mt-1 text-muted">{t.blurb}</p>
          <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {reelsIn(t)
              .slice(0, 4)
              .map((r) => (
                <li key={r.slug}>
                  <ReelCard reel={r} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
