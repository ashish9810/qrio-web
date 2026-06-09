import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
  metadataBase: new URL('https://qrioapp.in'),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Qrio',
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
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
