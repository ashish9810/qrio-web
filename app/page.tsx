import { supabase } from '@/lib/supabase'
import { Topic, getCategoryColor } from '@/lib/types'
import TopicCard from '@/components/TopicCard'
import Link from 'next/link'

export const revalidate = 60

async function getTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topic_with_stats')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching topics:', error)
    return []
  }
  return (data as Topic[]) || []
}

const CATEGORIES = [
  { key: 'geopolitics', label: 'Geopolitics' },
  { key: 'business', label: 'Business' },
  { key: 'indiamacro', label: 'India Macro' },
  { key: 'finance', label: 'Finance' },
  { key: 'tech', label: 'Tech & AI' },
]

export default async function HomePage() {
  const topics = await getTopics()

  return (
    <>
      {/* Page header */}
      <section className="text-center py-14 px-8 max-w-[1080px] mx-auto animate-fade-up">
        <p className="text-[13px] font-semibold text-accent tracking-wide mb-2.5">
          Qrio
        </p>
        <h1 className="font-serif text-[44px] font-bold leading-[1.15] tracking-tight text-ink">
          Get Smarter Every Day
        </h1>
        <p className="text-[17px] text-muted mt-3 max-w-[540px] mx-auto leading-relaxed">
          Carefully picked topics on geopolitics, business, finance, tech and more - explained in plain English. Brief in 30 seconds. Deep dive in 3 minutes.
        </p>

        {/* Category tags */}
        <div className="flex gap-2 justify-center mt-5 flex-wrap">
          {CATEGORIES.map((cat) => {
            const colors = getCategoryColor(cat.key)
            return (
              <span
                key={cat.key}
                className="text-xs font-semibold tracking-wide px-3.5 py-1.5 rounded-full cursor-default hover:scale-105 transition-transform"
                style={{ background: colors.bg, color: colors.text }}
              >
                {cat.label}
              </span>
            )
          })}
        </div>

        {/* Accent bar */}
        <div className="h-1 w-20 mx-auto mt-7 rounded-full bg-gradient-to-r from-accent-line via-accent to-accent-line" />
      </section>

      {/* Topics grid */}
      <section className="max-w-[1080px] mx-auto px-8 pb-12">
        <h2 className="font-serif text-[22px] font-semibold mb-6">Latest topics</h2>

        {topics.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-lg font-serif">No topics published yet.</p>
            <p className="text-sm mt-2">Check back tomorrow morning.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="max-w-[1080px] mx-auto px-8">
        <hr className="border-line" />
      </div>

      {/* How it works */}
      <section className="max-w-[1080px] mx-auto px-8 py-12">
        <p className="text-[13px] font-semibold text-accent tracking-wide text-center">
          How Qrio works
        </p>
        <h2 className="font-serif text-[28px] font-semibold text-center mt-2 mb-7">
          Learn more in less time
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: '📰',
              title: 'We pick the topics',
              desc: 'No doomscrolling. Every day, we pick the topics actually worth your time.',
            },
            {
              icon: '⚡',
              title: '30-second brief',
              desc: 'Get the core insight in ~80 words. Short enough to read between meetings.',
            },
            {
              icon: '📚',
              title: '3-minute deep dive',
              desc: 'Want the full picture? Clear, thorough, no jargon. Real understanding.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-card border border-line rounded-[14px] p-7 text-center hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-serif text-[17px] font-semibold mb-1">{item.title}</h3>
              <p className="text-[13.5px] text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About strip */}
      <section className="max-w-[1080px] mx-auto px-8 pb-12">
        <div className="bg-card border border-line rounded-[16px] p-8 flex gap-6 items-center hover:shadow-md transition-shadow max-md:flex-col max-md:text-center">
          <div className="w-[68px] h-[68px] rounded-full bg-accent-soft border border-accent-line flex items-center justify-center shrink-0">
            <span className="font-serif text-[26px] font-semibold text-accent">A</span>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold mb-1">
              Why I&apos;m building Qrio
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Most of what&apos;s happening in the world is actually fascinating.
              Almost none of it gets explained properly. Qrio is my attempt to fix
              that - one well-written explainer at a time.{' '}
              <Link
                href="/about"
                className="text-accent font-medium hover:underline hover:underline-offset-2 no-underline"
              >
                Read more &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
