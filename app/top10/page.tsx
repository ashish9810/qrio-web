import { notFound, redirect } from 'next/navigation'
import { getTopWeeks } from '@/lib/watch'

/** /top10 always shows the latest week. */
export default function TopLatest() {
  const latest = getTopWeeks()[0]
  if (!latest) notFound()
  redirect(`/top10/${latest.week}`)
}
