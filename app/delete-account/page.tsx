import type { Metadata } from 'next'
import LegalPage from '@/components/LegalPage'
import { CONTACT_EMAIL, LEGAL_LINKS } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Delete your account and data',
  alternates: { canonical: '/delete-account' },
}

const subject = encodeURIComponent('Delete my Qrio account and data')
const body = encodeURIComponent(
  'Please delete my Qrio account and data.\n\nPhone number or email I use with Qrio:\n',
)

export default function DeleteAccountPage() {
  return (
    <LegalPage title="Delete your account and data" updated="4 October 2026">
      <p>
        You can delete your Qrio account and the data linked to it at any time. There are
        two ways to do it.
      </p>

      <h2>Option 1: in the app</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Open Qrio and go to Profile.</li>
        <li>Tap Delete account and confirm.</li>
      </ol>
      <p>This is permanent and takes effect straight away.</p>

      <h2>Option 2: by email</h2>
      <p>
        If you cannot open the app, email{' '}
        <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`}>
          {CONTACT_EMAIL}
        </a>{' '}
        with the subject &quot;Delete my Qrio account and data&quot;. Tell us the phone
        number or email you use with Qrio. We will delete your data within 30 days.
      </p>

      <h2>What gets deleted</h2>
      <ul>
        <li>Your profile and preferences.</li>
        <li>Your watch history, likes, follows and comments.</li>
        <li>Your sign-in account.</li>
        <li>
          Anything you gave us on this website, such as an early-access signup or a
          creator application. Mention it in your email.
        </li>
      </ul>

      <p>
        For everything we collect and why, read the{' '}
        <a href={LEGAL_LINKS.privacy}>Privacy Policy</a>.
      </p>
    </LegalPage>
  )
}
