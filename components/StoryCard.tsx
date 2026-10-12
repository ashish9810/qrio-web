import Image from 'next/image'
import Link from 'next/link'
import { formatStoryDate, type Story } from '@/lib/archive'

/** Card used on the Stories hub, category pages and under each story. */
export default function StoryCard({
  story,
  priority = false,
  heading: Heading = 'h3',
}: {
  story: Story
  priority?: boolean
  /** Heading level for the title, so the page's heading order stays correct. */
  heading?: 'h2' | 'h3'
}) {
  return (
    <Link
      href={`/explainers/${story.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-card transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] bg-accent-soft">
        {story.cover && (
          <Image
            src={story.cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            quality={60}
            priority={priority}
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">{story.category.label}</p>
        <Heading className="mt-1.5 font-serif text-[20px] leading-[1.25] font-medium group-hover:text-accent">{story.title}</Heading>
        <p className="mt-2 line-clamp-3 text-[14.5px] text-muted">{story.brief}</p>
        <p className="mt-auto pt-4 text-xs text-muted">
          {formatStoryDate(story.date)} &middot; {story.readMinutes} min read
        </p>
      </div>
    </Link>
  )
}
