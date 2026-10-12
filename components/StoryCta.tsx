import CtaButton from './CtaButton'

/** End-of-story call to action. Points readers who like the written version to the videos. */
export default function StoryCta() {
  return (
    <aside className="my-12 rounded-3xl bg-deep p-8 text-center text-white md:p-10">
      <h2 className="font-serif text-[28px] leading-[1.15] font-medium">Prefer to watch it in a minute</h2>
      <p className="mx-auto mt-3 mb-6 max-w-[460px] text-[#b9b9cf]">
        Qrio is a free Android app of short videos on business, startups and the world. Fresh videos every day, made by creators we invite.
      </p>
      <CtaButton location="blog" />
    </aside>
  )
}
