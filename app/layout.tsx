import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import EarlyAccessProvider from '@/components/EarlyAccessProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SEO, SITE_NAME, SITE_URL } from '@/lib/content'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SEO.title, template: `%s | ${SITE_NAME}` },
  description: SEO.description,
  alternates: { canonical: '/' },
  // Search Console ownership, kept from the previous site so it stays verified.
  verification: { google: '4YFn791t9-5S82JkbJophHdzOID-JaL_CQO_KR_8s5k' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SEO.title,
    description: SEO.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.title,
    description: SEO.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#FAFAF7',
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SEO.description,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <EarlyAccessProvider
          posthogKey={process.env.POSTHOG_KEY}
          posthogHost={process.env.POSTHOG_HOST}
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </EarlyAccessProvider>
      </body>
    </html>
  )
}
