import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReelCard from '@/components/ReelCard'
import WatchPlayer from '@/components/WatchPlayer'
import CtaButton from '@/components/CtaButton'
import QrInstall from '@/components/QrInstall'
import { mostRelated } from '@/lib/related'
import { clock, getReel, getReels, isoDuration, previewSeconds, reelsIn } from '@/lib/watch'
import { SITE_NAME, SITE_URL } from '@/lib/content'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getReels().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const reel = getReel(slug)
  if (!reel) return {}
  return {
    title: reel.title,
    description: reel.summary,
    alternates: { canonical: `/watch/${reel.slug}` },
    openGraph: {
      type: 'video.other',
      url: `${SITE_URL}/watch/${reel.slug}`,
      siteName: SITE_NAME,
      title: reel.title,
      description: reel.summary,
      images: [{ url: reel.poster }],
    },
    twitter: { card: 'summary_large_image', title: reel.title, description: reel.summary, images: [reel.poster] },
  }
}

export default async function WatchPage({ params }: PageProps) {
  const { slug } = await params
  const reel = getReel(slug)
  if (!reel) notFound()

  const url = `${SITE_URL}/watch/${reel.slug}`
  const preview = previewSeconds(reel.durationSec)
  const pool = getReels().filter((r) => r.slug !== reel.slug)
  const related = mostRelated(`${reel.title} ${reel.transcript}`, pool, (r) => `${r.title} ${r.transcript}`, (r) => r.published, 4)
  const sameTopic = reelsIn(reel.topic).filter((r) => r.slug !== reel.slug && !related.includes(r)).slice(0, 4)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: reel.title,
      description: reel.summary,
      thumbnailUrl: [reel.poster],
      uploadDate: reel.published,
      duration: isoDuration(reel.durationSec),
      contentUrl: reel.video,
      embedUrl: url,
      url,
      inLanguage: 'en',
      genre: reel.topic.label,
      ...(reel.transcript ? { transcript: reel.transcript } : {}),
      creator: { '@type': 'Person', name: reel.creator.name, ...(reel.creator.instagram ? { sameAs: reel.creator.instagram } : {}) },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/apple-touch-icon.png` } },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Watch', item: `${SITE_URL}/watch` },
        { '@type': 'ListItem', position: 3, name: reel.topic.label, item: `${SITE_URL}/watch/topic/${reel.topic.slug}` },
        { '@type': 'ListItem', position: 4, name: reel.title, item: url },
      ],
    },
  ]

  return (
    <article className="mx-auto max-w-[1000px] px-5 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> /{' '}
        <Link href="/watch" className="hover:text-ink">Watch</Link> /{' '}
        <Link href={`/watch/topic/${reel.topic.slug}`} className="hover:text-ink">{reel.topic.label}</Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-[360px_1fr] md:items-start">
        <div className="md:sticky md:top-24">
          <WatchPlayer id={reel.id} src={reel.video} poster={reel.poster} title={reel.title} previewSec={preview} />
          <p className="mt-3 text-center text-[13px] text-muted">
            Preview: the first {preview} seconds of {clock(reel.durationSec)}. The full reel is free on Qrio.
          </p>
        </div>

        <div className="min-w-0">
          <p className="eyebrow">{reel.topic.label}</p>
          <h1 className="mt-2.5 font-serif text-[clamp(28px,4.5vw,40px)] leading-[1.15] font-medium tracking-[-0.02em]">{reel.title}</h1>
          <p className="mt-4 text-[13px] text-muted">
            A {clock(reel.durationSec)} reel by{' '}
            {reel.creator.instagram ? (
              <a href={reel.creator.instagram} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                {reel.creator.name}
              </a>
            ) : (
              reel.creator.name
            )}
            , a creator on Qrio
          </p>
          <p className="mt-5 text-[17px] leading-relaxed">{reel.summary}</p>

          <div className="mt-7 rounded-2xl bg-deep p-6 text-white">
            <p className="font-serif text-[22px] leading-tight">Watch the full reel free on Qrio</p>
            <p className="mt-2 mb-5 text-[14px] text-[#b9b9cf]">Reels that make you smarter: business, startups, tech and the world, one minute at a time. Free on Android.</p>
            <CtaButton location="watch" />
            <QrInstall dark />
          </div>

          {reel.transcript && (
            <section className="mt-10">
              <h2 className="text-[11px] font-bold tracking-wider text-muted uppercase">Transcript</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{reel.transcript}</p>
              <p className="mt-3 text-[12px] text-muted">Transcribed automatically from the video, so small errors are possible.</p>
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-[26px] leading-[1.15] font-medium">If you liked this</h2>
          <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((r) => (
              <li key={r.slug}>
                <ReelCard reel={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {sameTopic.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-[26px] leading-[1.15] font-medium">More {reel.topic.label}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {sameTopic.map((r) => (
              <li key={r.slug}>
                <ReelCard reel={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
