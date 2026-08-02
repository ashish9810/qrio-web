import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { absoluteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published topic slugs
  const { data: topics } = await supabase
    .from('topics')
    .select('slug, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const topicEntries: MetadataRoute.Sitemap = (topics || []).map((t) => ({
    url: absoluteUrl(`/explainers/${t.slug}`),
    lastModified: t.published_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: absoluteUrl('/'),
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...topicEntries,
  ]
}
