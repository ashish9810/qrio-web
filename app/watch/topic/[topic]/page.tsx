import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReelCard from '@/components/ReelCard'
import { activeTopics, getTopic, reelsIn } from '@/lib/watch'
import { SITE_URL } from '@/lib/content'

type PageProps = { params: Promise<{ topic: string }> }

export function generateStaticParams() {
  return activeTopics().map((t) => ({ topic: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: slug } = await params
  const topic = getTopic(slug)
  if (!topic) return {}
  return {
    title: `${topic.label} explained in 1-minute reels`,
    description: `${topic.blurb}. Short ${topic.label.toLowerCase()} videos from hand-picked creators, free on Qrio.`,
    alternates: { canonical: `/watch/topic/${topic.slug}` },
  }
}

export default async function WatchTopicPage({ params }: PageProps) {
  const { topic: slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()
  const reels = reelsIn(topic)
  if (reels.length === 0) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${topic.label} reels on Qrio`,
    url: `${SITE_URL}/watch/topic/${topic.slug}`,
    hasPart: reels.map((r) => ({ '@type': 'VideoObject', name: r.title, url: `${SITE_URL}/watch/${r.slug}` })),
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> /{' '}
        <Link href="/watch" className="hover:text-ink">Watch</Link>
      </nav>
      <h1 className="mt-4 font-serif text-[clamp(32px,5vw,48px)] leading-[1.1] font-medium tracking-[-0.02em]">
        {topic.label}, explained in a minute
      </h1>
      <p className="mt-3 max-w-[640px] text-lg text-muted">{topic.blurb}.</p>
      <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {reels.map((r, i) => (
          <li key={r.slug}>
            <ReelCard reel={r} heading="h2" priority={i < 4} />
          </li>
        ))}
      </ul>
    </div>
  )
}
