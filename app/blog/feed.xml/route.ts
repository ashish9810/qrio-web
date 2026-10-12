import { getAllPosts } from '@/lib/blog'
import { BLOG, SITE_URL } from '@/lib/content'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** RSS feed of published posts, for readers and for crawlers that like feeds. */
export function GET() {
  const posts = getAllPosts().filter((p) => p.status === 'published')
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(BLOG.title)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${esc(BLOG.description)}</description>
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
