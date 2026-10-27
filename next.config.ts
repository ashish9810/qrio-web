import type { NextConfig } from 'next'
import { LEGAL_LINKS } from './lib/content'

const nextConfig: NextConfig = {
  // Photos sit under dark overlays, so a lower quality is invisible and saves bytes.
  images: {
    qualities: [60, 75],
  },
  // Website analytics go to Mixpanel through this site, so ad blockers do not drop them.
  async rewrites() {
    return [
      { source: '/mp/:path*', destination: 'https://api-js.mixpanel.com/:path*' },
    ]
  },
  async redirects() {
    return [
      // The old About page is gone. The /explainers/* story URLs are kept, so rankings carry over.
      { source: '/about', destination: '/', statusCode: 301 },
      // Policies are hosted on GitHub Pages. Kept temporary so the host can change.
      { source: '/privacy', destination: LEGAL_LINKS.privacy, permanent: false },
      { source: '/terms', destination: LEGAL_LINKS.terms, permanent: false },
    ]
  },
}

export default nextConfig
