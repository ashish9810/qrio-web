import { HERO } from '@/lib/content'
import CtaButton from './CtaButton'
import PhoneMockup from './PhoneMockup'

export default function Hero() {
  return (
    <section id="top" className="pt-11 pb-[72px] md:pt-[72px] md:pb-24">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-5 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="font-serif text-[clamp(40px,6.5vw,68px)] leading-[1.04] font-medium tracking-[-0.02em]">
            {HERO.headlineBefore}
            <em className="text-accent italic">{HERO.headlineAccent}</em>
            {HERO.headlineAfter}
          </h1>
          <p className="mt-[22px] mb-[30px] max-w-[520px] text-xl text-muted">{HERO.sub}</p>
          <CtaButton location="hero" />
        </div>
        <PhoneMockup />
      </div>
    </section>
  )
}
