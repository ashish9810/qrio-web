import { supabase } from '@/lib/supabase'
import { Topic, getCategoryColor, categoryLabel, formatDate, readTime } from '@/lib/types'
import Link from 'next/link'
import ArticleMarkdown from '@/components/ArticleMarkdown'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 300

async function getTopic(slug: string): Promise<Topic | null> {
  const { data, error } = await supabase
    .from('topic_with_stats')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  return data as Topic
}

async function getRelatedTopics(currentId: string): Promise<Topic[]> {
  const { data } = await supabase
    .from('topic_with_stats')
    .select('*')
    .eq('status', 'published')
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(3)

  return (data as Topic[]) || []
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const topic = await getTopic(slug)
  if (!topic) return { title: 'Topic not found' }

  return {
    title: topic.headline,
    description: topic.brief.slice(0, 160),
    openGraph: {
      type: 'article',
      title: topic.headline,
      description: topic.brief.slice(0, 160),
      publishedTime: topic.published_at || undefined,
      authors: ['Qrio'],
      ...(topic.cover_image_url ? { images: [topic.cover_image_url] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: topic.headline,
      description: topic.brief.slice(0, 160),
    },
  }
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params
  const topic = await getTopic(slug)
  if (!topic) notFound()

  const related = await getRelatedTopics(topic.id)
  const colors = getCategoryColor(topic.category)
  const dateStr = formatDate(topic.published_at || topic.scheduled_for)
  const time = readTime(topic.deep_dive_md || topic.brief)

  // Generate FAQ from the topic for SEO/GEO
  const faqs = generateFAQs(topic)

  return (
    <>
      {/* JSON-LD: Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: topic.headline,
            description: topic.brief,
            datePublished: topic.published_at || topic.scheduled_for,
            author: { '@type': 'Organization', name: 'Qrio' },
            publisher: { '@type': 'Organization', name: 'Qrio', url: 'https://curioapp.in' },
            ...(topic.cover_image_url ? { image: topic.cover_image_url } : {}),
          }),
        }}
      />

      {/* JSON-LD: FAQPage */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      )}

      <article className="max-w-[680px] mx-auto px-6 pt-8 pb-16">
        {/* Back */}
        <Link
          href="/"
          className="text-[13px] text-muted no-underline hover:text-ink transition-colors inline-flex items-center gap-1.5 mb-5"
        >
          &larr; Back to all topics
        </Link>

        {/* Category */}
        <span
          className="inline-block text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-3.5"
          style={{ background: colors.bg, color: colors.text }}
        >
          {categoryLabel(topic.category)}
        </span>

        {/* Headline */}
        <h1 className="font-serif text-[34px] font-bold leading-[1.2] tracking-tight mb-3">
          {topic.headline}
        </h1>

        {/* Meta */}
        <p className="text-[13px] text-muted mb-7">
          {time} &middot; by Qrio &middot; {dateStr}
        </p>

        {/* Cover image — fixed height, cropped */}
        {topic.cover_image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden h-[300px]">
            <img
              src={topic.cover_image_url}
              alt={topic.headline}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* THE DEEP DIVE */}
        {topic.deep_dive_md && (
          <div className="mb-8">
            <div className="text-[11px] font-bold tracking-wider uppercase text-warm mb-4 flex items-center gap-1.5">
              <span>&#128218;</span> THE DEEP DIVE
            </div>
            <div className="prose">
              <ArticleMarkdown markdown={topic.deep_dive_md} />
            </div>
          </div>
        )}

        {/* Share */}
        <div className="flex items-center gap-3 pt-5 border-t border-line mt-8">
          <span className="text-[13px] text-muted font-medium">Share this:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(topic.headline + ' - read on Qrio')}&url=${encodeURIComponent(`https://curioapp.in/explainers/${topic.slug}`)}`}
            target="_blank"
            rel="noopener"
            className="w-9 h-9 rounded-[10px] border border-line bg-card flex items-center justify-center text-muted hover:bg-ink hover:text-white hover:border-ink transition-all no-underline text-sm"
          >
            &#120143;
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(topic.headline + ' - read on Qrio: https://curioapp.in/explainers/' + topic.slug)}`}
            target="_blank"
            rel="noopener"
            className="w-9 h-9 rounded-[10px] border border-line bg-card flex items-center justify-center text-muted hover:bg-ink hover:text-white hover:border-ink transition-all no-underline text-sm"
          >
            &#128172;
          </a>
        </div>

        {/* FAQ for SEO/GEO */}
        {faqs.length > 0 && (
          <section className="mt-10 pt-8 border-t border-line">
            <h2 className="font-serif text-[22px] font-semibold mb-5">
              Frequently Asked Questions
            </h2>
            {faqs.map((faq, i) => (
              <div key={i} className="mb-5">
                <h3 className="text-[15px] font-semibold text-ink mb-1">{faq.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </section>
        )}

        {/* CTA banner */}
        <div className="bg-ink rounded-2xl p-8 text-center mt-10 text-white">
          <h3 className="font-serif text-[22px] font-semibold">Get Smarter Every Day</h3>
          <p className="text-sm text-white/60 mt-1.5">
            New topics like this, delivered fresh. Free, no noise.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.qrio.qrio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent text-white px-7 py-3 rounded-xl text-sm font-semibold cursor-pointer hover:-translate-y-0.5 transition-transform no-underline mt-4"
          >
            Download Qrio
          </a>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <h3 className="font-serif text-xl font-semibold mb-4">More from Qrio</h3>
            {related.map((r) => {
              const rColors = getCategoryColor(r.category)
              return (
                <Link
                  key={r.id}
                  href={`/explainers/${r.slug}`}
                  className="flex gap-4 py-4 border-t border-line-soft no-underline text-inherit group"
                >
                  {r.cover_image_url ? (
                    <img
                      src={r.cover_image_url}
                      alt={r.headline}
                      className="w-20 h-[60px] rounded-[10px] shrink-0 object-cover"
                    />
                  ) : (
                    <div
                      className="w-20 h-[60px] rounded-[10px] shrink-0 flex items-center justify-center"
                      style={{ background: rColors.bg }}
                    >
                      <span className="text-xl opacity-40">
                        {r.category.toLowerCase().includes('geo') ? '🌐' :
                         r.category.toLowerCase().includes('tech') ? '🤖' :
                         r.category.toLowerCase().includes('biz') || r.category.toLowerCase().includes('business') ? '📈' :
                         r.category.toLowerCase().includes('india') ? '🇮🇳' :
                         r.category.toLowerCase().includes('fin') ? '💰' : '📰'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif text-[15px] font-semibold leading-snug group-hover:text-accent transition-colors">
                      {r.headline}
                    </h4>
                    <div className="text-xs text-muted2 mt-1">
                      {categoryLabel(r.category)} &middot; {readTime(r.deep_dive_md || r.brief)}
                    </div>
                  </div>
                </Link>
              )
            })}
          </section>
        )}
      </article>
    </>
  )
}

function generateFAQs(topic: Topic): { q: string; a: string }[] {
  const headline = topic.headline
  const category = categoryLabel(topic.category)
  const brief = topic.brief

  return [
    {
      q: `What is "${headline}" about?`,
      a: brief,
    },
    {
      q: `Why does this ${category.toLowerCase()} topic matter?`,
      a: `This topic covers a significant development in ${category.toLowerCase()} that affects economies, industries, and everyday people. Qrio breaks it down in plain English so you can understand the implications without needing specialized knowledge.`,
    },
    {
      q: `How long does it take to read this explainer?`,
      a: `The brief takes about 30 seconds. The full deep dive takes just a few minutes. You can choose how deep you want to go.`,
    },
  ]
}
