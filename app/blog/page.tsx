import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate, getAllPosts } from '@/lib/blog'
import { BLOG, SITE_URL } from '@/lib/content'

export const metadata: Metadata = {
  title: BLOG.title,
  description: BLOG.description,
  alternates: { canonical: '/blog' },
}

export default function BlogIndex() {
  const posts = getAllPosts()
  // Until the first post is published this page does not exist.
  if (posts.length === 0) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: BLOG.title,
    description: BLOG.description,
    url: `${SITE_URL}/blog`,
    publisher: { '@type': 'Organization', name: 'Qrio', url: SITE_URL },
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">Blog</p>
      <h1 className="mt-2.5 font-serif text-[clamp(34px,5vw,48px)] leading-[1.1] font-medium tracking-[-0.02em]">
        Getting smarter, one minute at a time
      </h1>
      <p className="mt-4 text-lg text-muted">{BLOG.description}</p>

      <ul className="mt-12 divide-y divide-line border-t border-line">
        {posts.map((post) => (
          <li key={post.slug} className="py-7">
            <p className="text-[13px] text-muted">
              {post.category} &middot; {formatDate(post.date)} &middot; {post.readMinutes} min read
              {post.status === 'draft' && (
                <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">
                  Draft
                </span>
              )}
            </p>
            <h2 className="mt-1.5 font-serif text-[26px] leading-[1.2] font-medium">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-muted">{post.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
