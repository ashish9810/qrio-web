import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import StoryCard from '@/components/StoryCard'
import { ARCHIVE_CATEGORIES, getCategoryBySlug, getStoriesIn } from '@/lib/archive'

type PageProps = { params: Promise<{ category: string }> }

export function generateStaticParams() {
  return ARCHIVE_CATEGORIES.filter((c) => getStoriesIn(c).length > 0).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const c = getCategoryBySlug(category)
  if (!c) return {}
  return {
    title: `${c.label} stories`,
    description: `${c.blurb}. Sourced ${c.label.toLowerCase()} stories in plain English from Qrio.`,
    alternates: { canonical: `/explainers/topic/${c.slug}` },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const c = getCategoryBySlug(category)
  if (!c) notFound()
  const stories = getStoriesIn(c)
  if (stories.length === 0) notFound()

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-14 md:py-20">
      <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> /{' '}
        <Link href="/explainers" className="hover:text-ink">Stories</Link>
      </nav>
      <h1 className="mt-5 font-serif text-[clamp(34px,5vw,48px)] leading-[1.1] font-medium tracking-[-0.02em]">{c.label} stories</h1>
      <p className="mt-3 max-w-[640px] text-lg text-muted">{c.blurb}</p>
      <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((s, i) => (
          <li key={s.slug}>
            <StoryCard story={s} priority={i === 0} heading="h2" />
          </li>
        ))}
      </ul>
    </div>
  )
}
