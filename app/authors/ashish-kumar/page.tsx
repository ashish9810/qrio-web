import type { Metadata } from 'next'
import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import { getAllPosts } from '@/lib/blog'
import { AUTHOR, CONTACT_EMAIL, SITE_NAME, SITE_URL, SOCIAL_LINKS } from '@/lib/content'

export const metadata: Metadata = {
  title: `${AUTHOR.name}, ${AUTHOR.role}`,
  description: `${AUTHOR.name} edits the Qrio blog and Stories. How we research, source and correct what we publish.`,
  alternates: { canonical: AUTHOR.path },
}

/** Author page: who writes the blog and Stories, and how posts are made (Google's Who / How / Why guidance). */
export default function AuthorPage() {
  const posts = getAllPosts().filter((p) => p.status === 'published')
  const url = `${SITE_URL}${AUTHOR.path}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url,
    mainEntity: {
      '@type': 'Person',
      name: AUTHOR.name,
      url,
      jobTitle: AUTHOR.role,
      description: AUTHOR.bio,
      worksFor: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL, sameAs: Object.values(SOCIAL_LINKS).filter(Boolean) },
    },
  }

  return (
    <article className="mx-auto max-w-[720px] px-5 py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="eyebrow">Author</p>
      <h1 className="mt-2.5 font-serif text-[clamp(34px,5vw,46px)] leading-[1.12] font-medium tracking-[-0.02em]">{AUTHOR.name}</h1>
      <p className="mt-2 text-muted">{AUTHOR.role}</p>
      <p className="mt-6 text-lg">{AUTHOR.bio}</p>

      <section className="prose-qrio mt-10">
        <h2>How we write</h2>
        <ul>
          <li>Every post starts from a question real people search for, or a business or world story in the news.</li>
          <li>We research with the help of AI tools, then check every number, study and quote against a source we have opened and read. Each claim links to its source, and each post lists its sources at the end.</li>
          <li>When research only shows a link and not a cause, we say so. We do not give medical or financial advice.</li>
          <li>When we mention Qrio, we say that we make it, and we include other options fairly.</li>
          <li>
            Found a mistake? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will correct it and note the update on the post.
          </li>
        </ul>
        <h2>Why we write</h2>
        <p>
          Qrio turns business, startup and world stories into short videos. The blog and the <Link href="/explainers">Stories</Link> archive are the written side: clear,
          sourced answers you can read in a few minutes.
        </p>
      </section>

      {posts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-[26px] leading-[1.15] font-medium">Latest from {AUTHOR.name.split(' ')[0]}</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {posts.slice(0, 6).map((p) => (
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
