import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogCard from '@/components/BlogCard'
import { getAllPosts } from '@/lib/blog'
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
    <div className="mx-auto max-w-[1100px] px-5 py-14 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">Blog</p>
      <h1 className="mt-2.5 font-serif text-[clamp(34px,5vw,48px)] leading-[1.1] font-medium tracking-[-0.02em]">
        Getting smarter, one minute at a time
      </h1>
      <p className="mt-4 max-w-[640px] text-lg text-muted">{BLOG.description}</p>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  )
}
