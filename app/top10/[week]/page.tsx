import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CtaButton from '@/components/CtaButton'
import { clock, getTopWeeks, weekLabel } from '@/lib/watch'
import { SITE_URL } from '@/lib/content'

type PageProps = { params: Promise<{ week: string }> }

export function generateStaticParams() {
  return getTopWeeks().map((w) => ({ week: w.week }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { week } = await params
  const w = getTopWeeks().find((x) => x.week === week)
  if (!w) return {}
  const title = `The 10 most-watched Qrio reels, ${weekLabel(w.from, w.to)}`
  return {
    title,
    description: `This week's most-watched one-minute reels on Qrio: ${w.items.slice(0, 3).map((i) => i.reel.title).join('; ')} and more.`,
    alternates: { canonical: `/top10/${w.week}` },
  }
}

export default async function TopWeekPage({ params }: PageProps) {
  const { week } = await params
  const weeks = getTopWeeks()
  const w = weeks.find((x) => x.week === week)
  if (!w) notFound()
  const latest = weeks[0].week === w.week

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top 10 Qrio reels, ${weekLabel(w.from, w.to)}`,
    itemListElement: w.items.map((i, n) => ({ '@type': 'ListItem', position: n + 1, url: `${SITE_URL}/watch/${i.reel.slug}`, name: i.reel.title })),
  }

  return (
    <div className="mx-auto max-w-[760px] px-5 py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">Top 10{latest ? ' this week' : ''}</p>
      <h1 className="mt-2.5 font-serif text-[clamp(30px,5vw,44px)] leading-[1.15] font-medium tracking-[-0.02em]">
        The 10 most-watched reels on Qrio
      </h1>
      <p className="mt-3 text-muted">{weekLabel(w.from, w.to)}. Ranked by how many people watched each one, among the reels that have a page on this site.</p>

      <ol className="mt-8 divide-y divide-line border-y border-line">
        {w.items.map((i, n) => (
          <li key={i.reel.slug}>
            <Link href={`/watch/${i.reel.slug}`} className="group flex items-center gap-4 py-4">
              <span className="w-8 shrink-0 font-serif text-[28px] text-accent">{n + 1}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.reel.posterSm} alt="" loading="lazy" className="h-[84px] w-[56px] shrink-0 rounded-lg object-cover" />
              <span className="min-w-0">
                <span className="block text-xs font-semibold tracking-wide text-accent uppercase">{i.reel.topic.label}</span>
                <span className="block font-serif text-[18px] leading-snug group-hover:text-accent">{i.reel.title}</span>
                <span className="block text-xs text-muted">
                  {clock(i.reel.durationSec)} &middot; by {i.reel.creator.name}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl bg-deep p-6 text-center text-white">
        <p className="font-serif text-[22px]">Watch all 10 free on Qrio</p>
        <p className="mt-2 mb-5 text-[14px] text-[#b9b9cf]">Reels that make you smarter. Free on Android.</p>
        <CtaButton location="watch" />
      </div>

      {weeks.length > 1 && (
        <section className="mt-12">
          <h2 className="text-[11px] font-bold tracking-wider text-muted uppercase">Earlier weeks</h2>
          <ul className="mt-3 space-y-1.5">
            {weeks
              .filter((x) => x.week !== w.week)
              .map((x) => (
                <li key={x.week}>
                  <Link href={`/top10/${x.week}`} className="text-accent hover:underline">{weekLabel(x.from, x.to)}</Link>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  )
}
