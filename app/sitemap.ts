import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { SITE_URL } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const posts = getAllPosts().filter((p) => p.status === 'published')

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    // The blog only exists in the sitemap once the first post is published.
    ...(posts.length > 0
      ? [
          { url: `${SITE_URL}/blog`, lastModified: posts[0].updated, changeFrequency: 'daily' as const, priority: 0.8 },
          ...posts.map((p) => ({
            url: `${SITE_URL}/blog/${p.slug}`,
            lastModified: p.updated,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
          })),
        ]
      : []),
    {
      url: `${SITE_URL}/delete-account`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
