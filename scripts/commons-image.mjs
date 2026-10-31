// Downloads a freely licensed photo from Wikimedia Commons for a Story, resizes it
// to webp, and prints the credit details (author, license, page) to put on the page.
// Usage: node scripts/commons-image.mjs "File:Some photo.jpg" public/covers/<slug>.webp [width]
// Search first: node scripts/commons-image.mjs --search "IndiGo A320neo"
import sharp from 'sharp'
import fs from 'node:fs'

const UA = { 'User-Agent': 'QrioBot/1.0 (info.ak.ashish@gmail.com)' }
const api = (params) =>
  fetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({ format: 'json', ...params }), { headers: UA }).then((r) => r.json())
const clean = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

const [first, out, width = '1200'] = process.argv.slice(2)

if (first === '--search') {
  const d = await api({ action: 'query', generator: 'search', gsrsearch: `${out} filetype:bitmap`, gsrnamespace: '6', gsrlimit: '10', prop: 'imageinfo', iiprop: 'size|extmetadata', iiextmetadatafilter: 'LicenseShortName|Artist' })
  for (const p of Object.values(d.query?.pages ?? {})) {
    const ii = p.imageinfo[0]
    const m = ii.extmetadata ?? {}
    console.log(`${p.title} | ${ii.width}x${ii.height} | ${m.LicenseShortName?.value ?? '?'} | ${clean(m.Artist?.value).slice(0, 120)}`)
  }
  process.exit(0)
}

if (!first || !out) {
  console.error('Usage: node scripts/commons-image.mjs "File:Name.jpg" public/covers/<slug>.webp [width]')
  process.exit(1)
}
const d = await api({ action: 'query', titles: first, prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1600' })
const ii = Object.values(d.query.pages)[0].imageinfo?.[0]
if (!ii) throw new Error(`Not found on Commons: ${first}`)
const m = ii.extmetadata ?? {}
const license = m.LicenseShortName?.value ?? ''
const ok = /^(CC0|Public domain|CC BY(-SA)? [0-9.]+)/i.test(license)
if (!ok) throw new Error(`License "${license}" is not one we use (CC0, public domain, CC BY, CC BY-SA)`)
const buf = Buffer.from(await (await fetch(ii.thumburl, { headers: UA })).arrayBuffer())
await sharp(buf).resize({ width: Number(width) }).webp({ quality: 78 }).toFile(out)
console.log(JSON.stringify({ out, kb: Math.round(fs.statSync(out).size / 1024), page: ii.descriptionurl, artist: clean(m.Artist?.value), license, licenseUrl: m.LicenseUrl?.value ?? null }, null, 1))
