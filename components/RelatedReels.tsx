import ReelCard from './ReelCard'
import { mostRelated } from '@/lib/related'
import { getReels } from '@/lib/watch'

/**
 * "Watch on Qrio" strip under blog posts and stories: the reels closest in
 * topic to the article (by shared words with the title and transcript), so a
 * reader can go straight from reading to watching.
 */
export default function RelatedReels({ text, count = 4 }: { text: string; count?: number }) {
  const reels = mostRelated(text, getReels(), (r) => `${r.title} ${r.title} ${r.transcript}`, (r) => r.published, count)
  if (reels.length === 0) return null
  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="font-serif text-[24px] leading-[1.15] font-medium">Watch on Qrio</h2>
      <p className="mt-1 text-[15px] text-muted">One-minute reels on this and related topics.</p>
      <ul className="mt-5 grid grid-cols-2 gap-4">
        {reels.map((r) => (
          <li key={r.slug}>
            <ReelCard reel={r} />
          </li>
        ))}
      </ul>
    </section>
  )
}
