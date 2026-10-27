import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

/**
 * Blog posts are markdown files in content/blog/. Each starts with frontmatter:
 *
 *   title:       headline (no full stop at the end)
 *   description: 140 to 160 characters, used for search results and sharing
 *   date:        YYYY-MM-DD first published
 *   updated:     YYYY-MM-DD last meaningful edit (optional)
 *   category:    one of CATEGORIES
 *   status:      draft | published
 *   format:      one of FORMATS (optional; defaults from the category). Used to
 *                compare which kind of post earns clicks and installs.
 *   faq:         optional list of { q, a } rendered as an FAQ and as FAQ markup
 *
 * Drafts are only visible in `next dev` (with a banner). Production builds
 * skip them, so a post goes live only when its status is changed to published.
 */

export const CATEGORIES = [
  'Doomscrolling',
  'Staying informed',
  'Explained',
  'Behind Qrio',
] as const

/**
 * Post formats being tested against each other (the weekly check compares
 * search clicks and Download clicks per format and shifts the mix):
 * guide = evergreen how-to, trending = explainer of a story in the news,
 * comparison = honest "best apps / alternatives" list, brand = about Qrio.
 */
export const FORMATS = ['guide', 'trending', 'comparison', 'brand'] as const
export type Format = (typeof FORMATS)[number]

function defaultFormat(category: string, slug: string): Format {
  if (category === 'Explained') return 'trending'
  if (category === 'Behind Qrio') return 'brand'
  if (/(^|-)apps(-|$)|^best-/.test(slug)) return 'comparison'
  return 'guide'
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  date: string
  updated: string
  category: string
  format: Format
  status: 'draft' | 'published'
  faq: { q: string; a: string }[]
  body: string
  readMinutes: number
}

const DIR = path.join(process.cwd(), 'content', 'blog')
const showDrafts = process.env.NODE_ENV === 'development'

function parse(file: string): BlogPost {
  const slug = file.replace(/\.md$/, '')
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), 'utf8'))
  const iso = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ''))
  const words = content.trim().split(/\s+/).length

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    date: iso(data.date),
    updated: iso(data.updated ?? data.date),
    category: String(data.category ?? 'Doomscrolling'),
    format: FORMATS.includes(data.format) ? data.format : defaultFormat(String(data.category ?? ''), slug),
    status: data.status === 'published' ? 'published' : 'draft',
    faq: Array.isArray(data.faq) ? data.faq : [],
    body: content.trim(),
    readMinutes: Math.max(1, Math.round(words / 220)),
  }
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(DIR)) return []
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .map(parse)
    .filter((p) => p.status === 'published' || showDrafts)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getPost(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null
}

/** True once at least one post is published. Gates the nav link, sitemap and /blog. */
export function hasPublishedPosts(): boolean {
  if (!fs.existsSync(DIR)) return false
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .some((f) => parse(f).status === 'published')
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
