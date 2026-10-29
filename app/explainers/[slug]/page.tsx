import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleMarkdown from '@/components/ArticleMarkdown'
import StoryCard from '@/components/StoryCard'
import ReadDepth from '@/components/ReadDepth'
import StoryCta from '@/components/StoryCta'
import BlogCard from '@/components/BlogCard'
import { getAllPosts } from '@/lib/blog'
import { mostRelated } from '@/lib/related'
import { formatStoryDate, getRelated, getStories, getStory } from '@/lib/archive'
import { AUTHOR, SITE_NAME, SITE_URL } from '@/lib/content'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getStories().map((s) => ({ slug: s.slug }))
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const story = getStory(slug)
  if (!story) return {}

  return {
    title: story.title,
    description: story.description,
    alternates: { canonical: `/explainers/${story.slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/explainers/${story.slug}`,
      siteName: SITE_NAME,
      title: story.title,
      description: story.description,
      publishedTime: story.date,
      authors: [AUTHOR.name],
      // The image comes from opengraph-image.tsx (1200x630, cover plus headline).
    },
    twitter: { card: 'summary_large_image', title: story.title, description: story.description },
  }
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params
  const story = getStory(slug)
  if (!story) notFound()

  const url = `${SITE_URL}/explainers/${story.slug}`
  const related = getRelated(story)
  const posts = mostRelated(
    `${story.title} ${story.brief}`,
    getAllPosts().filter((p) => p.status === 'published'),
    (p) => `${p.title} ${p.description}`,
    (p) => p.date,
  )
  const publisher = { '@type': 'Organization', name: SITE_NAME, url: SITE_URL }

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: story.title,
      description: story.brief,
      datePublished: story.date,
      dateModified: story.date,
      inLanguage: 'en',
      articleSection: story.category.label,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      author: { '@type': 'Person', name: AUTHOR.name, url: `${SITE_URL}${AUTHOR.path}` },
      publisher: { ...publisher, logo: { '@type': 'ImageObject', url: `${SITE_URL}/apple-touch-icon.png` } },
      image: [`${url}/opengraph-image`, ...(story.cover ? [`${SITE_URL}${story.cover}`] : [])],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Stories', item: `${SITE_URL}/explainers` },
        { '@type': 'ListItem', position: 3, name: story.category.label, item: `${SITE_URL}/explainers/topic/${story.category.slug}` },
        { '@type': 'ListItem', position: 4, name: story.title, item: url },
      ],
    },
  ]

  return (
    <article className="mx-auto max-w-[720px] px-5 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadDepth pageType="story" />

      <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> /{' '}
        <Link href="/explainers" className="hover:text-ink">Stories</Link> /{' '}
        <Link href={`/explainers/topic/${story.category.slug}`} className="hover:text-ink">{story.category.label}</Link>
      </nav>

      <p className="eyebrow mt-6">{story.category.label}</p>
      <h1 className="mt-2.5 font-serif text-[clamp(32px,5vw,44px)] leading-[1.15] font-medium tracking-[-0.02em]">{story.title}</h1>
      <p className="mt-4 text-[13px] text-muted">
        By{' '}
        <Link href={AUTHOR.path} className="underline-offset-2 hover:text-ink hover:underline">
          {AUTHOR.name}
        </Link>{' '}
        &middot; {formatStoryDate(story.date)} &middot; {story.readMinutes} min read
      </p>

      {story.cover && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-accent-soft">
          <Image src={story.cover} alt={story.title} fill priority sizes="(max-width: 768px) 100vw, 720px" quality={75} className="object-cover" />
        </div>
      )}
      {story.cover && story.coverCredit && (
        <div className="mt-2 text-[12px] text-muted [&_a]:underline [&_a]:underline-offset-2">
          <ArticleMarkdown markdown={story.coverCredit} />
        </div>
      )}

      <div className="mt-9">
        <div className="prose-qrio">
          <ArticleMarkdown markdown={story.body} />
        </div>
      </div>

      {story.sources.length > 0 && (
        <section className="mt-10 border-t border-line pt-6">
          <h2 className="text-[11px] font-bold tracking-wider text-muted uppercase">Sources</h2>
          <ul className="mt-3 space-y-1.5 text-[14px]">
            {story.sources.map((src) => (
              <li key={src}>
                <a href={src} target="_blank" rel="nofollow noopener noreferrer" className="break-all text-accent hover:underline">
                  {hostname(src)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <StoryCta />

      {related.length > 0 && (
        <section>
          <h2 className="font-serif text-[26px] leading-[1.15] font-medium">More {story.category.label.toLowerCase()} stories</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {related.slice(0, 2).map((r) => (
              <li key={r.slug}>
                <StoryCard story={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-[26px] leading-[1.15] font-medium">From the Qrio blog</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {posts.map((p) => (
              <li key={p.slug}>
                <BlogCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
