import Link from 'next/link'
import { Topic, getCategoryColor, categoryLabel, formatDate, readTime } from '@/lib/types'

export default function TopicCard({ topic }: { topic: Topic }) {
  const colors = getCategoryColor(topic.category)
  const coverBg = topic.cover_image_url
    ? undefined
    : `linear-gradient(135deg, ${colors.bg}, #F0EBE2)`

  return (
    <Link
      href={`/explainers/${topic.slug}`}
      className="group bg-card border border-line rounded-[14px] overflow-hidden no-underline text-inherit flex flex-col transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
    >
      {/* Image */}
      <div
        className="w-full h-[200px] flex items-center justify-center bg-cover bg-center"
        style={
          topic.cover_image_url
            ? { backgroundImage: `url(${topic.cover_image_url})` }
            : { background: coverBg }
        }
      >
        {!topic.cover_image_url && (
          <span className="text-4xl opacity-30">
            {topic.category.toLowerCase().includes('geo') ? '🌐' :
             topic.category.toLowerCase().includes('tech') ? '🤖' :
             topic.category.toLowerCase().includes('biz') || topic.category.toLowerCase().includes('business') ? '📈' :
             topic.category.toLowerCase().includes('india') ? '🇮🇳' :
             topic.category.toLowerCase().includes('fin') ? '💰' : '📰'}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-[22px] flex-1 flex flex-col">
        {/* Category */}
        <span
          className="text-[13px] font-semibold mb-2"
          style={{ color: colors.text }}
        >
          {categoryLabel(topic.category)}
        </span>

        {/* Title + arrow */}
        <div className="flex justify-between items-start gap-3 mb-2.5">
          <h3 className="font-serif text-xl font-semibold leading-snug flex-1">
            {topic.headline}
          </h3>
          <span className="w-7 h-7 rounded-lg border border-line flex items-center justify-center text-sm text-muted shrink-0 mt-0.5 transition-all group-hover:bg-ink group-hover:text-white group-hover:border-ink">
            &#8599;
          </span>
        </div>

        {/* Brief excerpt */}
        <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1">
          {topic.brief}
        </p>

        {/* Author + date */}
        <div className="flex items-center gap-2.5 pt-4 mt-auto">
          <div className="w-[34px] h-[34px] rounded-full bg-accent-soft border border-accent-line flex items-center justify-center">
            <span className="font-serif text-sm font-semibold text-accent">Q</span>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-ink">Qrio</div>
            <div className="text-[13px] text-muted2">
              {formatDate(topic.published_at || topic.scheduled_for)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
