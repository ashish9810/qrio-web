import type { MetadataRoute } from 'next'
import { getActiveCategories, getStories } from '@/lib/archive'
import { getAllPosts } from '@/lib/blog'
import { AUTHOR, SITE_URL } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const posts = getAllPosts().filter((p) => p.status === 'published')
  const stories = getStories()

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
    // Archived stories keep their original URLs so existing rankings carry over.
    { url: `${SITE_URL}/explainers`, lastModified: stories[0]?.date, changeFrequency: 'weekly' as const, priority: 0.8 },
    ...getActiveCategories().map((c) => ({
      url: `${SITE_URL}/explainers/topic/${c.slug}`,
      lastModified: stories.find((s) => s.category.slug === c.slug)?.date,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...stories.map((s) => ({
      url: `${SITE_URL}/explainers/${s.slug}`,
      lastModified: s.date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}${AUTHOR.path}`, changeFrequency: 'monthly' as const, priority: 0.4 },
    {
      url: `${SITE_URL}/delete-account`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
