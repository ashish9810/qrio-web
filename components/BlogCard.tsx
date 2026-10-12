import Image from 'next/image'
import Link from 'next/link'
import { formatDate, type BlogPost } from '@/lib/blog'

/**
 * A blog post as a card: logo, category pill, centred title, then the date and
 * read time under a divider. The whole card is one link, so it is easy to tap.
 */
export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_12px_32px_rgba(20,20,43,0.08)]"
    >
      <div className="flex justify-end gap-2">
        {post.status === 'draft' && (
          <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent">Draft</span>
        )}
        <span className="rounded-full border border-line px-3.5 py-1 text-sm text-muted">{post.category}</span>
      </div>

      {/* Qrio logo: the app icon next to the wordmark */}
      <div className="flex items-center justify-center gap-3 py-9" aria-hidden="true">
        <Image src="/apple-touch-icon.png" alt="" width={56} height={56} className="rounded-[14px]" />
        <span className="font-serif text-[44px] leading-none font-semibold tracking-[-0.03em] text-ink">Qrio</span>
      </div>

      <h2 className="font-serif text-[22px] leading-[1.3] font-medium text-ink group-hover:text-accent">{post.title}</h2>

      <div className="mt-auto pt-6">
        <div className="border-t border-line pt-4 text-[14px] text-muted">
          {formatDate(post.date)} <span aria-hidden="true">&middot;</span> {post.readMinutes} min read
        </div>
      </div>
    </Link>
  )
}
