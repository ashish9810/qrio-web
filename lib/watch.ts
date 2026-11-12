import fs from 'node:fs'
import path from 'node:path'

/**
 * Watch pages (/watch/<slug>): one page per Qrio reel, so search engines and
 * AI assistants can find our videos. The data is a snapshot built from the
 * app's database by scripts/watch/build_data.py into content/watch.json:
 * title, short summary, transcript (made on our Mac with faster-whisper),
 * creator credit and the real video file. Nothing here talks to the database
 * at runtime.
 */

export type WatchTopic = { slug: string; label: string; blurb: string }

export type WatchReel = {
  id: string
  slug: string
  title: string
  summary: string
  transcript: string
  topic: WatchTopic
  creator: { name: string; handle: string; avatar: string | null; instagram: string | null }
  video: string
  poster: string
  /** Smaller copy for cards (thumbs-sm, about 80 KB). */
  posterSm: string
  durationSec: number
  published: string // ISO
  width: number
  height: number
}

export const WATCH_TOPICS: WatchTopic[] = [
  { slug: 'business', label: 'Business', blurb: 'How companies, brands and fortunes are really built' },
  { slug: 'startups', label: 'Startups', blurb: 'Founder stories, pitches and the lessons behind them' },
  { slug: 'geopolitics', label: 'Geopolitics', blurb: 'Maps, borders, wars and the world news behind the headlines' },
  { slug: 'tech-and-ai', label: 'Tech & AI', blurb: 'How the tools you use every day actually work' },
  { slug: 'history', label: 'History', blurb: 'The past that explains the present' },
  { slug: 'finance', label: 'Finance', blurb: 'Money, markets and the numbers that matter' },
  { slug: 'science', label: 'Science', blurb: 'The why behind the world around you' },
  { slug: 'ideas', label: 'Psychology & Ideas', blurb: 'How we think, decide and live' },
]

type Raw = Omit<WatchReel, 'topic'> & { topic: string }

let cache: WatchReel[] | null = null

export function getReels(): WatchReel[] {
  if (cache) return cache
  const file = path.join(process.cwd(), 'content', 'watch.json')
  if (!fs.existsSync(file)) return (cache = [])
  const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as Raw[]
  cache = raw
    .map((r) => ({ ...r, topic: WATCH_TOPICS.find((t) => t.slug === r.topic) ?? WATCH_TOPICS[0] }))
    .sort((a, b) => b.published.localeCompare(a.published))
  return cache
}

export function getReel(slug: string): WatchReel | undefined {
  return getReels().find((r) => r.slug === slug)
}

export function getTopic(slug: string): WatchTopic | undefined {
  return WATCH_TOPICS.find((t) => t.slug === slug)
}

export function reelsIn(topic: WatchTopic): WatchReel[] {
  return getReels().filter((r) => r.topic.slug === topic.slug)
}

export function activeTopics(): WatchTopic[] {
  return WATCH_TOPICS.filter((t) => reelsIn(t).length > 0)
}

/** "PT1M8S" for schema.org. */
export function isoDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `PT${m ? `${m}M` : ''}${s}S`
}

/** "1:08" */
export function clock(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

/** How much of the reel the website plays before handing over to the app. */
export function previewSeconds(durationSec: number): number {
  return Math.min(30, Math.max(15, Math.round(durationSec * 0.4)))
}

export type TopWeek = { week: string; from: string; to: string; items: { reel: WatchReel; viewers: number }[] }

/** Weekly Top 10 lists (content/top10/<year>-w<week>.json), newest first. */
export function getTopWeeks(): TopWeek[] {
  const dir = path.join(process.cwd(), 'content', 'top10')
  if (!fs.existsSync(dir)) return []
  const bySlug = new Map(getReels().map((r) => [r.slug, r]))
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as { week: string; from: string; to: string; items: { slug: string; viewers: number }[] })
    .map((w) => ({
      ...w,
      items: w.items.flatMap((i) => {
        const reel = bySlug.get(i.slug)
        return reel ? [{ reel, viewers: i.viewers }] : []
      }),
    }))
    .filter((w) => w.items.length > 0)
    .sort((a, b) => b.week.localeCompare(a.week))
}

/** "3 to 9 November 2026" */
export function weekLabel(from: string, to: string): string {
  const f = new Date(from)
  const t = new Date(to)
  const month = (d: Date) => d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })
  const same = f.getUTCMonth() === t.getUTCMonth()
  return `${f.getUTCDate()}${same ? '' : ` ${month(f)}`} to ${t.getUTCDate()} ${month(t)} ${t.getUTCFullYear()}`
}
