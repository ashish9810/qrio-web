import Hero from '@/components/Hero'
import { About, Faq, FinalCta, ForCreators, HowItWorks, Topics } from '@/components/Sections'
import { APP_LIVE, FAQ, PLAY_STORE_URL, SEO, SITE_NAME, SITE_URL } from '@/lib/content'

/** Tells search engines and AI tools what the app is, and answers the FAQ in a machine-readable way. */
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: SITE_NAME,
    description: SEO.description,
    url: SITE_URL,
    operatingSystem: 'ANDROID',
    applicationCategory: 'MultimediaApplication',
    inLanguage: 'en',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    // Only point to the store listing once the app is publicly launched.
    ...(APP_LIVE ? { downloadUrl: PLAY_STORE_URL, installUrl: PLAY_STORE_URL } : {}),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  },
]

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <HowItWorks />
      <Topics />
      <ForCreators />
      <About />
      <Faq />
      <FinalCta />
    </>
  )
}
