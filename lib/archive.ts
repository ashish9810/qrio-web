import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

/**
 * The archive: Qrio's earlier written stories, snapshotted from the old app
 * into content/archive/<slug>.md (see scripts/export-archive.mjs). They keep the
 * same URLs as before (/explainers/<slug>) so existing search rankings carry
 * over. The site now calls this section "Stories".
 */

export type ArchiveCategory = {
  key: string // value stored in the data, for example "indiamacro"
  slug: string // used in the URL, for example "india-macro"
  label: string
  blurb: string
}

export const ARCHIVE_CATEGORIES: ArchiveCategory[] = [
  { key: 'business', slug: 'business', label: 'Business', blurb: 'Deals, strategy and the companies behind the headlines' },
  { key: 'geopolitics', slug: 'geopolitics', label: 'Geopolitics', blurb: 'How power, trade and conflict shape the world' },
  { key: 'indiamacro', slug: 'india-macro', label: 'India Macro', blurb: 'The Indian economy, policy and what it means for you' },
  { key: 'tech', slug: 'tech-and-ai', label: 'Tech & AI', blurb: 'Technology, AI and the businesses building them' },
  { key: 'finance', slug: 'finance', label: 'Finance', blurb: 'Markets, money and the numbers that matter' },
]

export type Story = {
  slug: string
  title: string
  category: ArchiveCategory
  date: string // full ISO timestamp
  description: string
  brief: string
  cover: string
  sources: string[]
  body: string
  readMinutes: number
}

const DIR = path.join(process.cwd(), 'content', 'archive')

function categoryFor(key: string): ArchiveCategory {
  return (
    ARCHIVE_CATEGORIES.find((c) => c.key === key.toLowerCase()) ?? {
      key,
      slug: key.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: key,
      blurb: '',
    }
  )
}

let cache: Story[] | null = null

export function getStories(): Story[] {
  if (cache) return cache
  if (!fs.existsSync(DIR)) return (cache = [])

  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file): Story => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'))
      const body = content.trim()
      return {
        slug: file.replace(/\.md$/, ''),
        title: String(data.title),
        category: categoryFor(String(data.category)),
        date: String(data.date),
        description: String(data.description ?? '').trim(),
        brief: String(data.brief ?? '').trim(),
        cover: String(data.cover ?? ''),
        sources: Array.isArray(data.sources) ? data.sources : [],
        body,
        readMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
  return cache
}

export function getStory(slug: string): Story | undefined {
  return getStories().find((s) => s.slug === slug)
}

export function getCategoryBySlug(slug: string): ArchiveCategory | undefined {
  return ARCHIVE_CATEGORIES.find((c) => c.slug === slug)
}

export function getStoriesIn(category: ArchiveCategory): Story[] {
  return getStories().filter((s) => s.category.slug === category.slug)
}

/** Categories that actually have stories, in display order. */
export function getActiveCategories(): ArchiveCategory[] {
  const present = new Set(getStories().map((s) => s.category.slug))
  return ARCHIVE_CATEGORIES.filter((c) => present.has(c.slug))
}

export function getRelated(story: Story, count = 3): Story[] {
  return getStories()
    .filter((s) => s.slug !== story.slug && s.category.slug === story.category.slug)
    .slice(0, count)
}

export function formatStoryDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })
}
