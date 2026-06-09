export interface Topic {
  id: string
  slug: string
  category: string
  headline: string
  brief: string
  deep_dive_md: string
  cover_image_url: string
  status: string
  scheduled_for: string
  published_at: string | null
  created_at: string
  sources_urls: string[]
  view_count?: number
}

export const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  geopolitics: { text: '#8C5037', bg: '#F0E2D8' },
  indiamacro: { text: '#6B6038', bg: '#EFEAD9' },
  'india macro': { text: '#6B6038', bg: '#EFEAD9' },
  business: { text: '#2D5B49', bg: '#E2ECE6' },
  finance: { text: '#5A4A6B', bg: '#ECE5F0' },
  'finance & markets': { text: '#5A4A6B', bg: '#ECE5F0' },
  tech: { text: '#345B7A', bg: '#DEE8F0' },
  'tech & ai': { text: '#345B7A', bg: '#DEE8F0' },
}

export function getCategoryColor(category: string) {
  const key = category.toLowerCase()
  return CATEGORY_COLORS[key] || { text: '#3A6E5B', bg: '#E6EFEA' }
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function readTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    geopolitics: 'Geopolitics',
    indiamacro: 'India Macro',
    'india macro': 'India Macro',
    business: 'Business',
    finance: 'Finance',
    'finance & markets': 'Finance & Markets',
    tech: 'Tech & AI',
    'tech & ai': 'Tech & AI',
  }
  return labels[category.toLowerCase()] || category
}
