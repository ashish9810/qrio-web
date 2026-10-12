#!/usr/bin/env node
/**
 * Builds the website's featured creator videos from real Qrio reels.
 *
 * For every entry in scripts/featured.config.json it reads the reel and its
 * creator from Supabase (public data), downloads the video, cuts a short silent
 * looping preview, takes a poster frame, fetches the creator's avatar, and writes
 * everything to public/featured/ plus lib/featured.json (which the site imports).
 *
 *   node scripts/featured.mjs
 *
 * Needs ffmpeg on the machine and the Supabase URL and anon key in .env.local.
 * Config entry: { "reelId": "...", "title": "text shown on the card", "start": 2,
 *                 "focus": "50% 35%" }   (start = seconds into the reel, focus = CSS object-position)
 * Only feature creators who have agreed to be shown on the website.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
)
const base = process.env.SUPABASE_URL ?? env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const headers = { apikey: key, Authorization: `Bearer ${key}` }

const TOPIC = { geopolitics: 'Geopolitics', business_strategy: 'Business', startups: 'Startups' }
const TONES = ['r1', 'r2', 'r3', 'c4']
const LOOP_SECONDS = 8
const config = JSON.parse(fs.readFileSync('scripts/featured.config.json', 'utf8'))
const outDir = path.join('public', 'featured')
fs.mkdirSync(outDir, { recursive: true })
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qrio-featured-'))
const ffmpeg = (...args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args])

async function download(url, file) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`)
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
}

const out = []
for (const [i, entry] of config.entries()) {
  const res = await fetch(`${base}/rest/v1/reels?id=eq.${entry.reelId}&status=eq.published&select=id,categories,duration_ms,video_url,creators(handle,name,avatar_url)`, { headers })
  const [reel] = await res.json()
  if (!reel) throw new Error(`Reel ${entry.reelId} not found or not published`)
  const creator = reel.creators
  const slug = `${creator.handle.replace(/[^a-z0-9]/gi, '-')}-${reel.id.slice(0, 6)}`

  const source = path.join(tmp, `${slug}.mp4`)
  await download(reel.video_url, source)
  const video = path.join(outDir, `${slug}.mp4`)
  const poster = path.join(outDir, `${slug}-poster.jpg`)
  const avatar = path.join(outDir, `${slug}-avatar.jpg`)

  ffmpeg('-ss', String(entry.start ?? 2), '-t', String(LOOP_SECONDS), '-i', source, '-an',
    '-vf', 'scale=540:960:force_original_aspect_ratio=increase,crop=540:960,fps=25,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-profile:v', 'main', '-movflags', '+faststart', video)
  ffmpeg('-i', video, '-frames:v', '1', '-q:v', '4', poster)

  const avatarSource = path.join(tmp, `${slug}-avatar-src`)
  await download(creator.avatar_url, avatarSource)
  ffmpeg('-i', avatarSource, '-vf', 'scale=112:112:force_original_aspect_ratio=increase,crop=112:112', '-q:v', '4', avatar)

  const seconds = Math.round((reel.duration_ms ?? 0) / 1000)
  out.push({
    tone: TONES[i % TONES.length],
    topic: TOPIC[reel.categories?.[0]] ?? 'Business',
    title: entry.title,
    name: creator.name,
    length: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
    video: `/${video.replace(/^public\//, '')}`,
    poster: `/${poster.replace(/^public\//, '')}`,
    avatar: `/${avatar.replace(/^public\//, '')}`,
    focus: entry.focus ?? '50% 35%',
  })
  console.log(`${creator.name}: ${entry.title} (${(fs.statSync(video).size / 1024).toFixed(0)} KB)`)
}

fs.writeFileSync(path.join('lib', 'featured.json'), JSON.stringify(out, null, 2) + '\n')
fs.rmSync(tmp, { recursive: true, force: true })
console.log(`Wrote lib/featured.json with ${out.length} videos`)
