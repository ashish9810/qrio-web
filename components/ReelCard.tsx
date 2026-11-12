import Link from 'next/link'
import { clock, type WatchReel } from '@/lib/watch'

/** Card linking to a watch page. Used on /watch, topic pages and under blog posts and stories. */
export default function ReelCard({
  reel,
  heading: Heading = 'h3',
  priority = false,
}: {
  reel: WatchReel
  heading?: 'h2' | 'h3'
  priority?: boolean
}) {
  return (
    <Link
      href={`/watch/${reel.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-card transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-accent-soft">
        {/* Thumbnails come from Qrio's media host, already sized for phones. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={reel.posterSm}
          alt={`${reel.title}, a video by ${reel.creator.name}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-2.5 bottom-2.5 rounded-full bg-black/70 px-2 py-0.5 text-[12px] font-medium text-white">
          ▶ {clock(reel.durationSec)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">{reel.topic.label}</p>
        <Heading className="mt-1.5 font-serif text-[18px] leading-[1.25] font-medium group-hover:text-accent">{reel.title}</Heading>
        <p className="mt-auto pt-3 text-xs text-muted">by {reel.creator.name}</p>
      </div>
    </Link>
  )
}
