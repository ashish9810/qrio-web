import Image from 'next/image'
import { CREATORS, FAQ, FINAL_CTA, HOW, SAMPLE_VIDEOS, TOPICS } from '@/lib/content'
import CtaButton from './CtaButton'
import CreatorForm from './CreatorForm'
import Reveal from './Reveal'

const h2Class =
  'mt-2.5 mb-[18px] font-serif text-[clamp(32px,5vw,48px)] leading-[1.1] font-medium tracking-[-0.02em]'

export function HowItWorks() {
  return (
    <section id="how" className="py-[72px] md:py-24">
      <div className="mx-auto max-w-[1100px] px-5">
        <Reveal>
          <div className="eyebrow">{HOW.eyebrow}</div>
          <h2 className={h2Class}>{HOW.heading}</h2>
        </Reveal>
        <ol className="mt-11 grid gap-5 md:grid-cols-3">
          {HOW.steps.map((step, i) => (
            <li key={step.title}>
              <Reveal className="h-full rounded-3xl border border-line bg-card p-[30px]">
                <div
                  className="mb-[18px] grid h-[38px] w-[38px] place-items-center rounded-full bg-accent-soft font-semibold text-accent"
                  aria-hidden="true"
                >
                  {i + 1}
                </div>
                <h3 className="mb-1.5 font-serif text-[26px] font-medium">{step.title}</h3>
                <p className="text-muted">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Topics() {
  return (
    <section className="pb-[72px] md:pb-24">
      <div className="mx-auto max-w-[1100px] px-5">
        <Reveal>
          <div className="eyebrow">{TOPICS.eyebrow}</div>
          <h2 className={h2Class}>{TOPICS.heading}</h2>
        </Reveal>
        <ul className="mt-[30px] mb-9 flex flex-wrap gap-2.5">
          {TOPICS.active.map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-ink px-[18px] py-2 text-[15px] font-medium"
            >
              {topic}
            </li>
          ))}
          {TOPICS.soon.map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-line px-[18px] py-2 text-[15px] font-medium text-muted"
            >
              {topic}
              <small className="ml-1.5 text-[11px] tracking-[0.05em] uppercase">
                {TOPICS.soonLabel}
              </small>
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {SAMPLE_VIDEOS.map((video) => (
            <li key={video.title}>
              <Reveal>
                <div className={`vcard tone-${video.tone}`}>
                  <Image
                    src={video.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 46vw, 260px"
                    quality={60}
                    fetchPriority="low"
                    className="object-cover"
                    style={{ objectPosition: video.focus }}
                  />
                  <div className="vcard-shade" />
                  <div className="vcard-play" aria-hidden="true">
                    &#9654;
                  </div>
                  <div className="vcard-body">
                    <div className="vcard-creator">
                      <Image
                        src={video.avatar}
                        alt=""
                        width={22}
                        height={22}
                        className="vcard-avatar"
                      />
                      {video.creator}
                    </div>
                    <div className="font-serif text-[19px] leading-[1.2]">{video.title}</div>
                    <div className="mt-2 text-xs opacity-80">
                      {video.topic} &middot; {video.length}
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-3.5 text-[13px] text-muted">{TOPICS.note}</p>
      </div>
    </section>
  )
}

export function ForCreators() {
  return (
    <section id="creators" className="bg-accent-soft py-[72px] md:py-24">
      <div className="mx-auto grid max-w-[1100px] items-start gap-14 px-5 md:grid-cols-2">
        <Reveal>
          <div className="eyebrow">{CREATORS.eyebrow}</div>
          <h2 className={h2Class}>{CREATORS.heading}</h2>
          <p className="max-w-[620px] text-[19px] text-muted">{CREATORS.lead}</p>
          <ul className="mt-[26px]">
            {CREATORS.perks.map((perk) => (
              <li
                key={perk.bold}
                className="flex gap-3 border-b border-accent/15 py-3"
              >
                <span className="font-bold text-accent" aria-hidden="true">
                  &#10003;
                </span>
                <span>
                  <strong>{perk.bold}</strong> {perk.body}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <CreatorForm />
        </Reveal>
      </div>
    </section>
  )
}

export function Faq() {
  return (
    <section className="py-[72px] md:py-24">
      <div className="mx-auto max-w-[1100px] px-5">
        <div className="eyebrow">{FAQ.eyebrow}</div>
        <h2 className={h2Class}>{FAQ.heading}</h2>
        <div className="max-w-[760px]">
          {FAQ.items.map((item) => (
            <details key={item.q} className="faq-item border-b border-line py-[22px]">
              <summary>{item.q}</summary>
              <p className="mt-2.5 text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="py-24 text-center md:py-[110px]">
      <div className="mx-auto max-w-[1100px] px-5">
        <h2 className={`${h2Class} mx-auto mb-[30px] max-w-[700px]`}>{FINAL_CTA.heading}</h2>
        <CtaButton location="final" />
      </div>
    </section>
  )
}
