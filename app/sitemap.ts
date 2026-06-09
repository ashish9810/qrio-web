import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published topic slugs
  const { data: topics } = await supabase
    .from('topics')
    .select('slug, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const topicEntries: MetadataRoute.Sitemap = (topics || []).map((t) => ({
    url: `https://curioapp.in/explainers/${t.slug}`,
    lastModified: t.published_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://curioapp.in',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://curioapp.in/about',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...topicEntries,
  ]
}
