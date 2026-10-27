import type { MetadataRoute } from 'next'
import { SEO, SITE_NAME } from '@/lib/content'

/**
 * Points Chrome on Android at the Play app. With prefer_related_applications,
 * Chrome offers to install Qrio from Google Play (the native app install
 * prompt) instead of installing the website. StickyAppBar uses that prompt.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SEO.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF7',
    theme_color: '#FAFAF7',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    related_applications: [
      {
        platform: 'play',
        id: 'com.qrio.qrio',
        url: 'https://play.google.com/store/apps/details?id=com.qrio.qrio',
      },
    ],
    prefer_related_applications: true,
  }
}
