import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogCard from '@/components/BlogCard'
import BlogCta from '@/components/BlogCta'
import BlogMarkdown from '@/components/BlogMarkdown'
import { formatDate, getAllPosts, getPost } from '@/lib/blog'
import { BLOG, SITE_NAME, SITE_URL } from '@/lib/content'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    // A draft previewed in dev must never be indexed.
    robots: post.status === 'draft' ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [BLOG.author],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const url = `${SITE_URL}/blog/${post.slug}`
  const more = getAllPosts().filter((p) => p.slug !== post.slug && p.status === 'published').slice(0, 2)
  const author = { '@type': 'Organization', name: BLOG.author, url: SITE_URL }

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated,
      inLanguage: 'en',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      author,
      publisher: {
        ...author,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/apple-touch-icon.png` },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ]
  if (post.faq.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  return (
    <article className="mx-auto max-w-[720px] px-5 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {post.status === 'draft' && (
        <p className="mb-6 rounded-xl border border-dashed border-accent/40 bg-accent-soft px-4 py-3 text-sm text-deep">
          <strong>Draft preview.</strong> This post is not published and is hidden on the live site.
        </p>
      )}

      <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> /{' '}
        {post.status === 'published' ? (
          <Link href="/blog" className="hover:text-ink">Blog</Link>
        ) : (
          <span>Blog</span>
        )}
      </nav>

      <p className="eyebrow mt-6">{post.category}</p>
      <h1 className="mt-2.5 font-serif text-[clamp(34px,5vw,46px)] leading-[1.12] font-medium tracking-[-0.02em]">
        {post.title}
      </h1>
      <p className="mt-4 text-[13px] text-muted">
        By {BLOG.author} &middot; Published {formatDate(post.date)}
        {post.updated !== post.date && <> &middot; Updated {formatDate(post.updated)}</>} &middot;{' '}
        {post.readMinutes} min read
      </p>

      <div className="mt-9">
        <BlogMarkdown>{post.body}</BlogMarkdown>
      </div>

      {post.faq.length > 0 && (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-serif text-[28px] leading-[1.15] font-medium">Frequently asked questions</h2>
          <div className="mt-5 space-y-6">
            {post.faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-serif text-[20px] leading-snug font-medium">{f.q}</h3>
                <p className="mt-1.5 text-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <BlogCta />

      {more.length > 0 && (
        <section>
          <h2 className="font-serif text-[26px] leading-[1.15] font-medium">More from the blog</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {more.map((p) => (
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
