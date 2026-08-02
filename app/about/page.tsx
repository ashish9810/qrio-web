import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Why Qrio exists, how it works, and who is building it.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="max-w-[640px] mx-auto px-6 pt-12 pb-16">
      <h1 className="font-serif text-4xl font-bold mb-2">About Qrio</h1>
      <p className="text-[16px] text-muted mb-9">
        Get Smarter Every Day.
      </p>

      <p className="text-[15px] text-ink-soft leading-[1.75] mb-4">
        There&apos;s no shortage of information. But there&apos;s a real shortage
        of understanding. Most people don&apos;t have time to read long reports or
        sit through jargon-heavy explainers. They just want to know what matters
        and why - clearly, quickly, and in a way that sticks.
      </p>
      <p className="text-[15px] text-ink-soft leading-[1.75] mb-8">
        That&apos;s what Qrio is building. We hand-pick topics that are worth your
        time - across geopolitics, business, finance, tech, and India macro - and
        explain them properly, in plain English, so you walk away genuinely smarter.
      </p>

      <h2 className="font-serif text-[22px] font-semibold mt-9 mb-3">How it works</h2>
      <p className="text-[15px] text-ink-soft leading-[1.75] mb-4">
        Every day, our team selects the topics worth knowing. We do the research,
        cut through the complexity, and break each topic into two layers:
      </p>
      <p className="text-[15px] text-ink-soft leading-[1.75] mb-4">
        <strong>The Brief (30 seconds)</strong> - The core insight in ~80 words.
        Enough to understand the big picture. Short enough to read between
        meetings.
      </p>
      <p className="text-[15px] text-ink-soft leading-[1.75] mb-8">
        <strong>The Deep Dive (3 minutes)</strong> - The full story. Written in
        plain English, no jargon, no filler. Just real understanding you can carry
        with you.
      </p>

      <h2 className="font-serif text-[22px] font-semibold mt-9 mb-4">
        What we believe
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: '✍️',
            title: 'Clarity over cleverness',
            desc: "If it's not clear, it's not done. We write to explain, not to impress.",
          },
          {
            icon: '💡',
            title: 'Depth without length',
            desc: '3 minutes is enough to understand anything if the writing is good enough.',
          },
          {
            icon: '🌱',
            title: 'Grow slowly, grow right',
            desc: 'No growth hacks. No engagement traps. Just well-curated content, every day.',
          },
          {
            icon: '🙌',
            title: 'Respect your time',
            desc: 'Every topic is chosen deliberately. Your time is worth spending wisely.',
          },
        ].map((v) => (
          <div
            key={v.title}
            className="bg-card border border-line rounded-[14px] p-5"
          >
            <div className="text-2xl mb-2">{v.icon}</div>
            <h3 className="text-[15px] font-semibold mb-1">{v.title}</h3>
            <p className="text-[13px] text-muted">{v.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-[22px] font-semibold mt-9 mb-3">
        Who&apos;s building this
      </h2>
      <p className="text-[15px] text-ink-soft leading-[1.75] mb-8">
        Qrio is built by a small team that believes being well-informed
        shouldn&apos;t take an hour of your morning or a journalism degree.
        We&apos;re growing slowly on purpose - focused on getting the content
        right, one topic at a time. We&apos;re early. We&apos;re learning.
        And we&apos;d love to hear from you.
      </p>

      {/* Contact box */}
      <div className="bg-accent-soft border border-accent-line rounded-2xl p-7 mt-9">
        <h3 className="font-serif text-xl font-semibold mb-2">
          Got thoughts? We&apos;re listening.
        </h3>
        <p className="text-sm text-muted mb-3">
          Whether it&apos;s a topic suggestion, feedback on the content, or just
          a &quot;hey, I liked this&quot; - we read every message. Seriously.
        </p>
        <a
          href="mailto:info.ak.ashish@gmail.com"
          className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-[10px] text-sm font-semibold no-underline hover:-translate-y-0.5 transition-transform"
        >
          &#9993; Write to us
        </a>
      </div>
    </div>
  )
}
