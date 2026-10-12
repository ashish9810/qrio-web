#!/usr/bin/env node
/**
 * Checks blog posts against Qrio's editorial rules.
 * Usage: node scripts/check-post.mjs [slug ...]   (no arguments checks every post)
 * Exits with 1 if any post breaks a rule.
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const dir = path.join(process.cwd(), 'content', 'blog')
const wanted = process.argv.slice(2)
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && (wanted.length === 0 || wanted.includes(f.replace(/\.md$/, ''))))

const BANNED = /\b(learn\w*|educat\w*|explainer\w*|knowledge|upskill\w*|intellectual\w*|reels?)\b/i
const CATEGORIES = ['Doomscrolling', 'Staying informed', 'Explained', 'Behind Qrio']
let failed = false

for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), 'utf8')
  const { data, content } = matter(raw)
  const problems = []
  const iso = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ''))
  // Words inside link URLs do not count, only the text a reader sees.
  const visible = content.replace(/\]\([^)]*\)/g, ']')

  if (!data.title) problems.push('missing title')
  if (String(data.title ?? '').trim().endsWith('.')) problems.push('title ends with a full stop')
  const dl = String(data.description ?? '').length
  if (dl < 120 || dl > 160) problems.push(`description is ${dl} characters, want 120 to 160`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso(data.date))) problems.push('date must be YYYY-MM-DD')
  if (!CATEGORIES.includes(data.category)) problems.push(`category must be one of: ${CATEGORIES.join(', ')}`)
  if (!['draft', 'published'].includes(data.status)) problems.push('status must be draft or published')
  if (raw.includes('—')) problems.push('contains an em dash')
  const banned = visible.match(new RegExp(BANNED, 'gi'))
  if (banned) problems.push(`banned words in text: ${[...new Set(banned.map((w) => w.toLowerCase()))].join(', ')}`)
  const badHeadings = (content.match(/^#{1,6} .*$/gm) ?? []).filter((h) => h.trim().endsWith('.'))
  if (badHeadings.length) problems.push(`headings end with a full stop: ${badHeadings.join(' | ')}`)
  if (/^# /m.test(content)) problems.push('body must not contain an H1 (the title is the H1)')
  if (!/^## Sources/m.test(content)) problems.push('missing a "## Sources" section')
  if (!Array.isArray(data.faq) || data.faq.length < 3) problems.push('add at least 3 FAQ items in frontmatter')
  const words = visible.trim().split(/\s+/).length
  if (words < 900) problems.push(`only ${words} words, want 900 or more`)

  if (problems.length) {
    failed = true
    console.log(`FAIL ${file}\n  - ${problems.join('\n  - ')}`)
  } else {
    console.log(`PASS ${file} (${words} words, ${dl} char description)`)
  }
}
process.exit(failed ? 1 : 0)
