import { BLOG } from '@/lib/content'
import CtaButton from './CtaButton'

/** End-of-post call to action. */
export default function BlogCta() {
  return (
    <aside className="my-12 rounded-3xl bg-deep p-8 text-center text-white md:p-10">
      <h2 className="font-serif text-[28px] leading-[1.15] font-medium">{BLOG.cta.heading}</h2>
      <p className="mx-auto mt-3 mb-6 max-w-[460px] text-[#b9b9cf]">{BLOG.cta.body}</p>
      <CtaButton location="blog" />
    </aside>
  )
}
