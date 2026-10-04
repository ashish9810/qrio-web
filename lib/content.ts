/**
 * Single source of truth for Qrio's marketing site: flags, links and copy.
 * Edit this file to change anything users see. No em dashes in copy, please.
 */

// ---------------------------------------------------------------------------
// Flags and links
// ---------------------------------------------------------------------------

/**
 * Flip to `true` on launch day. "Get early access" buttons then become
 * "Get it on Google Play" (linking to PLAY_STORE_URL). iPhone visitors still
 * see the early-access modal, titled "iPhone coming soon".
 */
export const APP_LIVE = false

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.qrio.qrio'

export const SITE_URL = 'https://www.qrioapp.in'
export const SITE_NAME = 'Qrio'

// TODO: confirm the public contact address (this is the one the app already uses).
export const CONTACT_EMAIL = 'info.ak.ashish@gmail.com'

// TODO: add the real profile URLs. A link with an empty URL is hidden in the footer.
export const SOCIAL_LINKS = {
  instagram: '',
  youtube: '',
  x: '',
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export const SEO = {
  title: 'Qrio: Short videos that make you smarter every day',
  description:
    'Swipe through quick stories on business, startups and the world, made by invited creators. Free on Android.',
  ogAlt: 'Qrio. Short videos that make you smarter every day.',
}

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

export const CTA = {
  earlyAccess: 'Get early access',
  playStore: 'Get it on Google Play',
}

export const HERO = {
  // The word "smarter" is rendered in italic accent colour by the Hero component.
  headlineBefore: 'Short videos that make you ',
  headlineAccent: 'smarter',
  headlineAfter: ' every day.',
  sub: 'Swipe through quick stories on business, startups and the world. Made by invited creators. Every video worth your time.',
}

/** Illustrative sample content for the phone mockup and sample cards. Not real videos. */
export const SAMPLE_VIDEOS = [
  {
    tone: 'r1',
    topic: 'Startups',
    title: 'Why Zepto keeps raising money',
    creator: '@creator.one',
    length: '58 sec',
  },
  {
    tone: 'r2',
    topic: 'Geopolitics',
    title: 'What the US tariffs mean for India',
    creator: '@creator.two',
    length: '61 sec',
  },
  {
    tone: 'r3',
    topic: 'Business',
    title: 'How Jio priced its way to the top',
    creator: '@creator.three',
    length: '54 sec',
  },
  {
    tone: 'c4',
    topic: 'Startups',
    title: 'The startup that sold for 10x in 2 years',
    creator: '@creator.four',
    length: '49 sec',
  },
] as const

export const HOW = {
  eyebrow: 'How it works',
  heading: 'As easy as the apps you already scroll.',
  steps: [
    { title: 'Open', body: 'Fresh videos every day, ready when you are.' },
    {
      title: 'Swipe',
      body: 'Short and vertical, about a minute each. Nothing to read, nothing to set up.',
    },
    {
      title: 'Get smarter',
      body: 'Close the app knowing something new about business and the world.',
    },
  ],
}

export const TOPICS = {
  eyebrow: "What you'll watch",
  heading: 'Topics worth your time.',
  active: ['Business', 'Startups', 'Geopolitics'],
  soon: ['Tech', 'AI', 'Science'],
  soonLabel: 'soon',
  note: "Examples of what's coming.",
}

export const CREATORS = {
  eyebrow: 'For creators',
  heading: 'Make smart videos? Become a Founding Creator.',
  lead: 'Reach a new audience that is here for exactly the kind of videos you make.',
  perks: [
    {
      bold: 'No extra effort.',
      body: 'Share the same videos you already post on other platforms. Nothing new to make.',
    },
    {
      bold: 'Founding Creator perks.',
      body: 'A special badge, plus first access to paid deals and partnerships when we launch.',
    },
  ],
  form: {
    name: 'Your name',
    namePlaceholder: 'Full name',
    instagram: 'Instagram handle',
    instagramPlaceholder: '@yourhandle',
    topics: 'Topics you make videos on',
    topicsHint: '(pick all that apply)',
    whatsapp: 'WhatsApp number',
    whatsappPlaceholder: '+91 98765 43210',
    submit: 'Apply as a creator',
    sending: 'Sending...',
    success: "Thanks! We'll review your videos and reach out on WhatsApp.",
  },
}

export const CREATOR_TOPICS = [
  'Business',
  'Startups',
  'Geopolitics',
  'Indian politics',
  'Tech / AI',
  'Science',
  'Other',
] as const

export const FAQ = {
  eyebrow: 'Questions',
  heading: 'Good to know.',
  items: [
    { q: 'Is Qrio free?', a: 'Yes. Every video is free to watch.' },
    {
      q: 'Is it on iPhone?',
      a: "Android first. iPhone is coming. Join the waitlist and we'll tell you.",
    },
    {
      q: 'Who makes the videos?',
      a: 'Our own small team and creators we invite. Nobody else can post.',
    },
    {
      q: 'How is this different from Instagram or YouTube?',
      a: 'Same swipe, different feed. Every video on Qrio is a short, smart story on business, startups or the world. Nothing else.',
    },
    { q: 'When does it launch?', a: 'November 2026 on Google Play.' },
  ],
}

export const FINAL_CTA = {
  heading: 'Give your scrolling a better payoff.',
}

export const FOOTER = {
  tagline: 'Short videos that make you smarter every day. Made in India.',
}

export const MODAL = {
  title: 'Get early access',
  titleIphone: 'iPhone coming soon',
  sub: 'Be the first to try Qrio when it launches.',
  email: 'Email',
  emailPlaceholder: 'you@email.com',
  or: 'or',
  whatsapp: 'WhatsApp number',
  whatsappPlaceholder: '+91 98765 43210',
  submit: 'Get early access',
  sending: 'Sending...',
  successTitle: 'Early access reserved.',
  successBody: 'We will notify you once we launch.',
  close: 'Close',
}

export const ERRORS = {
  waitlistEmpty: 'Please fill either your email ID or WhatsApp number.',
  email: 'Please enter a valid email ID.',
  phone: 'Please enter a valid WhatsApp number.',
  creatorMissing: 'Please fill all fields and pick at least one topic.',
  instagram: 'Please enter a valid Instagram handle.',
  generic: 'Something went wrong. Please try again.',
}
