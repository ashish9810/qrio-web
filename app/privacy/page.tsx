import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage, { Todo } from '@/components/LegalPage'
import { CONTACT_EMAIL } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="TODO: add date">
      <Todo>
        This is placeholder text. Review every section, have it checked against the
        actual app (login, notifications, analytics SDKs) and remove these TODO notes
        before launch and before submitting to Google Play.
      </Todo>

      <p>
        Qrio (&quot;we&quot;, &quot;us&quot;) is a short-video app and website. This
        page explains what we collect, why, and how you can ask us to delete it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Early access signups:</strong> your email address and/or WhatsApp
          number, the page source you came from (UTM tags) and whether you use
          Android, iPhone or something else.
        </li>
        <li>
          <strong>Creator applications:</strong> your name, Instagram handle, the
          topics you make videos on and your WhatsApp number.
        </li>
        <li>
          <strong>Basic analytics:</strong> page views and button clicks on this
          website, without cookies and without your email or number.
        </li>
      </ul>
      <Todo>
        Add what the Android app collects (account details, usage, device and
        notification tokens) once the app is final.
      </Todo>

      <h2>Why we collect it</h2>
      <ul>
        <li>To tell you when Qrio launches.</li>
        <li>To review creator applications and contact you on WhatsApp.</li>
        <li>To understand which pages and campaigns bring people to Qrio.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        We do not sell your data. It is stored with our service providers (database
        hosting and analytics) only to run Qrio.
      </p>
      <Todo>List the providers by name (Supabase, Vercel, PostHog) and their regions.</Todo>

      <h2>How long we keep it</h2>
      <Todo>Decide and state a retention period for waitlist and creator data.</Todo>

      <h2>Your choices and deleting your data</h2>
      <p>
        You can ask us to access, correct or delete your data at any time. Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or follow the steps on
        our <Link href="/delete-account">account and data deletion page</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
