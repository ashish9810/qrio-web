import { getAllPosts } from '@/lib/blog'
import { APP_LIVE, BLOG, CONTACT_EMAIL, FAQ, PLAY_STORE_URL, SEO, SITE_URL } from '@/lib/content'

/**
 * llms.txt: a plain-language summary of the site for AI assistants and
 * crawlers. See https://llmstxt.org. Regenerated from the same content as the
 * pages, so it never drifts out of date.
 */
export function GET() {
  const posts = getAllPosts().filter((p) => p.status === 'published')

  const lines = [
    '# Qrio',
    '',
    `> ${SEO.description}`,
    '',
    'Qrio is a free Android app of short vertical videos about business, startups and the world, made by an in-house team and invited creators. It is a doomscrolling alternative: the same swipe, with every video worth your time. Audience: young working professionals and students in Indian cities.',
    '',
    '## Key facts',
    '',
    '- Platform: Android (iPhone is planned)',
    '- Price: free',
    '- Topics: business, startups, geopolitics (tech, AI and science coming)',
    `- Status: ${APP_LIVE ? 'available on Google Play' : 'early access, launching on Google Play in November 2026'}`,
    '',
    '## Pages',
    '',
    `- [Home](${SITE_URL}): what Qrio is, how it works, topics, creator applications and FAQ`,
    `- [Get the app on Google Play](${PLAY_STORE_URL})`,
    `- [Delete your account and data](${SITE_URL}/delete-account)`,
    ...(posts.length > 0 ? [`- [${BLOG.title}](${SITE_URL}/blog): ${BLOG.description}`] : []),
    '',
    ...(posts.length > 0
      ? ['## Blog posts', '', ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`), '']
      : []),
    '## FAQ',
    '',
    ...FAQ.items.flatMap((item) => [`**${item.q}** ${item.a}`, '']),
    '## Contact',
    '',
    `- ${CONTACT_EMAIL}`,
    '',
  ]

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
