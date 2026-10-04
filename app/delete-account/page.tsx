import type { Metadata } from 'next'
import LegalPage, { Todo } from '@/components/LegalPage'
import { CONTACT_EMAIL } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Delete your account and data',
  alternates: { canonical: '/delete-account' },
}

const subject = encodeURIComponent('Delete my Qrio account and data')
const body = encodeURIComponent(
  'Please delete my Qrio account and data.\n\nEmail or phone number I used with Qrio:\n',
)

export default function DeleteAccountPage() {
  return (
    <LegalPage title="Delete your account and data" updated="TODO: add date">
      <Todo>
        Google Play requires this page. Confirm the steps and timeline below match
        what you will actually do, and add an in-app deletion path once the app has
        accounts.
      </Todo>

      <p>You can ask us to delete your Qrio account and the data linked to it at any time.</p>

      <h2>How to request deletion</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`}>
            {CONTACT_EMAIL}
          </a>{' '}
          from the email address you used with Qrio, or mention the WhatsApp number you
          signed up with.
        </li>
        <li>Use the subject line &quot;Delete my Qrio account and data&quot;.</li>
        <li>We will confirm by reply once it is done.</li>
      </ol>

      <h2>What gets deleted</h2>
      <ul>
        <li>Your account details.</li>
        <li>Early access signup details (email, WhatsApp number).</li>
        <li>Creator application details, if you applied.</li>
      </ul>
      <Todo>
        Add app data (saves, likes, follows, notification tokens) and anything we must
        keep by law, with how long.
      </Todo>

      <h2>How long it takes</h2>
      <Todo>State the deletion timeline (for example, within 30 days of your request).</Todo>
    </LegalPage>
  )
}
