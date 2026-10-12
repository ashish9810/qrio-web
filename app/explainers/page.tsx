import type { Metadata } from 'next'
import Link from 'next/link'
import StoryCard from '@/components/StoryCard'
import { getActiveCategories, getStories, getStoriesIn } from '@/lib/archive'
import { SITE_URL } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Stories: business, startups and geopolitics in plain English',
  description:
    'Qrio Stories: clear, sourced write-ups on business deals, startups, the Indian economy, tech and world affairs, one story at a time.',
  alternates: { canonical: '/explainers' },
}

export default function StoriesHub() {
  const stories = getStories()
  const categories = getActiveCategories()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Qrio Stories',
    url: `${SITE_URL}/explainers`,
    hasPart: stories.slice(0, 20).map((s) => ({ '@type': 'Article', headline: s.title, url: `${SITE_URL}/explainers/${s.slug}` })),
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">Stories</p>
      <h1 className="mt-2.5 max-w-[760px] font-serif text-[clamp(34px,5vw,52px)] leading-[1.1] font-medium tracking-[-0.02em]">
        The story behind the headline, in plain English
      </h1>
      <p className="mt-4 max-w-[640px] text-lg text-muted">
        Sourced write-ups on business, startups, the Indian economy, tech and the world. Prefer video? Qrio turns stories like these into one-minute videos.
      </p>

      <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Browse by topic">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/explainers/topic/${c.slug}`}
              className="inline-block rounded-full border border-ink px-[18px] py-2 text-[15px] font-medium hover:bg-ink hover:text-white"
            >
              {c.label} <span className="text-muted">({getStoriesIn(c).length})</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 mb-6 font-serif text-[28px] leading-[1.15] font-medium">Latest stories</h2>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stories.slice(0, 12).map((s, i) => (
          <li key={s.slug}>
            <StoryCard story={s} priority={i === 0} />
          </li>
        ))}
      </ul>

      {categories.map((c) => {
        const inCategory = getStoriesIn(c)
        return (
          <section key={c.slug} className="mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-serif text-[28px] leading-[1.15] font-medium">{c.label}</h2>
              <Link href={`/explainers/topic/${c.slug}`} className="text-[15px] text-accent hover:underline">
                All {inCategory.length} stories
              </Link>
            </div>
            <p className="mt-1 text-muted">{c.blurb}</p>
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {inCategory.slice(0, 5).map((s) => (
                <li key={s.slug} className="py-3.5">
                  <Link href={`/explainers/${s.slug}`} className="font-serif text-[19px] leading-snug hover:text-accent">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
