/**
 * Canonical origin for the site. Vercel 308-redirects the bare domain to www,
 * so every absolute URL we emit — canonicals, sitemap, JSON-LD — must use www
 * or we point crawlers at URLs that redirect.
 */
export const SITE_URL = 'https://www.qrioapp.in'

export const SITE_NAME = 'Qrio'

/** Absolute URL for a path like "/explainers/foo". */
export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString().replace(/\/$/, '') || SITE_URL
}
