import Hero from '@/components/Hero'
import { Faq, FinalCta, ForCreators, HowItWorks, Topics } from '@/components/Sections'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Topics />
      <ForCreators />
      <Faq />
      <FinalCta />
    </>
  )
}
