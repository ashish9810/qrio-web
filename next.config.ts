import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The previous site was article based. Send its old URLs to the new landing page.
      { source: '/explainers/:path*', destination: '/', statusCode: 301 },
      { source: '/about', destination: '/', statusCode: 301 },
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
