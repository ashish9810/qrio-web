import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MobileAppBanner from '@/components/MobileAppBanner'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Qrio - Get Smarter Every Day',
    template: '%s | Qrio',
  },
  description:
    'Carefully picked topics on geopolitics, business, finance, tech and more - explained in plain English. Brief in 30 seconds. Deep dive in 3 minutes.',
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Qrio - Get Smarter Every Day',
    description:
      'Carefully picked topics explained in plain English. Brief in 30 seconds. Deep dive in 3 minutes.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qrio - Get Smarter Every Day',
    description:
      'Carefully picked topics explained in plain English. Brief in 30 seconds. Deep dive in 3 minutes.',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileAppBanner />
      </body>
      <GoogleAnalytics gaId="G-4Y2TCG9TLQ" />
    </html>
  )
}
