import type { Metadata } from 'next'
import LegalPage, { Todo } from '@/components/LegalPage'
import { CONTACT_EMAIL } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Terms of Use',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="TODO: add date">
      <Todo>
        This is placeholder text, not legal advice. Review it (ideally with a lawyer)
        and remove these TODO notes before launch.
      </Todo>

      <p>
        By using the Qrio website or app you agree to these terms. If you do not
        agree, please do not use Qrio.
      </p>

      <h2>Using Qrio</h2>
      <p>
        Qrio is free to use. You must use it lawfully and must not misuse, copy or
        disrupt the service.
      </p>

      <h2>Videos and creators</h2>
      <p>
        Videos on Qrio are made by our team and by creators we invite. Creators keep
        ownership of their videos and give Qrio permission to show them in the app.
      </p>
      <Todo>
        Add the creator licence terms (what rights Qrio gets, takedown process,
        Founding Creator perks and any future paid deals).
      </Todo>

      <h2>Not advice</h2>
      <p>
        Videos on business, startups and the world are for general interest. They are
        not financial, legal or investment advice.
      </p>

      <h2>Changes and availability</h2>
      <p>
        We may change or stop parts of Qrio, and we may update these terms. The date
        above shows the latest version.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
