import type { NextConfig } from 'next'
import { LEGAL_LINKS } from './lib/content'

const nextConfig: NextConfig = {
  // Photos sit under dark overlays, so a lower quality is invisible and saves bytes.
  images: { qualities: [60, 75] },
  async redirects() {
    return [
      // The previous site was article based. Send its old URLs to the new landing page.
      { source: '/explainers/:path*', destination: '/', statusCode: 301 },
      { source: '/about', destination: '/', statusCode: 301 },
      // Policies are hosted on GitHub Pages. Kept temporary so the host can change.
      { source: '/privacy', destination: LEGAL_LINKS.privacy, permanent: false },
      { source: '/terms', destination: LEGAL_LINKS.terms, permanent: false },
      // Short link used in posts and bios.
      {
        source: '/get',
        destination: 'https://play.google.com/store/apps/details?id=com.qrio.qrio',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
