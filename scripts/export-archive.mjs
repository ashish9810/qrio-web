#!/usr/bin/env node
/**
 * One-time snapshot of the old published articles (Supabase `topics` table)
 * into content/archive/<slug>.md, so the site serves them statically and keeps
 * working even if the database is unavailable. Re-run to refresh the snapshot.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL /
 * SUPABASE_ANON_KEY) from .env.local. The anon key is enough: published topics are public.
 *
 * Cover images are downloaded and converted to 1200px WebP in public/covers/
 * so pages do not depend on the old image host. Uses sharp (installed with Next.js).
 *
 * House rules applied while exporting: no em dashes, and no full stop at the end of
 * a title or heading. Slugs are never changed, so existing URLs and rankings stay.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'
import sharp from 'sharp'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
)
const url = process.env.SUPABASE_URL ?? env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const res = await fetch(
  `${url}/rest/v1/topics?select=slug,category,headline,brief,deep_dive_md,cover_image_url,published_at,scheduled_for,sources_urls&status=eq.published&order=published_at.asc&limit=1000`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
)
if (!res.ok) throw new Error(`Supabase returned ${res.status}`)
const topics = await res.json()

const noDash = (s) => s.replace(/\s*—\s*/g, ', ')
const noStop = (s) => s.trim().replace(/(?<!\.)\.$/, '')
const dir = path.join('content', 'archive')
const coverDir = path.join('public', 'covers')
fs.mkdirSync(dir, { recursive: true })
fs.mkdirSync(coverDir, { recursive: true })

/** Downloads a cover and returns its local path, or '' if it cannot be fetched. */
async function saveCover(slug, source) {
  if (!source) return ''
  const target = path.join(coverDir, `${slug}.webp`)
  if (fs.existsSync(target)) return `/covers/${slug}.webp`
  try {
    const res = await fetch(source)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const input = Buffer.from(await res.arrayBuffer())
    const toWebp = (buf) => sharp(buf).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 72 }).toFile(target)
    try {
      await toWebp(input)
    } catch {
      // Some files are a format sharp cannot read (for example AVIF saved as .png). Let ffmpeg decode them first.
      const raw = path.join(os.tmpdir(), `cover-${slug}`)
      fs.writeFileSync(raw, input)
      const png = `${raw}.png`
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, png])
      await toWebp(fs.readFileSync(png))
      fs.rmSync(raw)
      fs.rmSync(png)
    }
    return `/covers/${slug}.webp`
  } catch (err) {
    console.warn(`Cover failed for ${slug}: ${err.message}`)
    return ''
  }
}

let written = 0
for (const t of topics) {
  const body = noDash(t.deep_dive_md)
    .split('\n')
    .map((line) => (/^#{1,6} /.test(line) ? noStop(line) : line))
    .join('\n')
    .trim()
  const brief = noDash(t.brief).trim()
  const data = {
    title: noStop(noDash(t.headline)),
    category: t.category,
    date: new Date(t.published_at ?? t.scheduled_for).toISOString(),
    description: brief.slice(0, 160),
    brief,
    cover: await saveCover(t.slug, t.cover_image_url),
    sources: Array.isArray(t.sources_urls) ? t.sources_urls : [],
  }
  fs.writeFileSync(path.join(dir, `${t.slug}.md`), matter.stringify(`\n${body}\n`, data))
  written++
}
console.log(`Wrote ${written} articles to ${dir}/`)
