// Tell Bing and other IndexNow engines about every URL in the live sitemap.
// Usage: node scripts/indexnow.mjs   (run after a deploy; free, no account needed)
const HOST = 'www.qrioapp.in'
const KEY = 'c77c83cdbcaf2078511143a294b0f04c'
const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text()
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
})
console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${res.status}`)
