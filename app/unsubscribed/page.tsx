import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { CONTACT_EMAIL } from '@/lib/content'

export const metadata: Metadata = {
  title: 'You are unsubscribed',
  robots: { index: false },
}

export default function UnsubscribedPage() {
  return (
    <LegalPage title="You are unsubscribed" updated="23 November 2026">
      <p>
        We will not send you any more emails from Qrio. The app and your account are not
        affected, and you can keep watching as before.
      </p>
      <p>
        Changed your mind, or something does not look right? Write to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
