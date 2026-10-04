# Qrio website (qrioapp.in)

Marketing site for Qrio: an Android app of short vertical videos that make you smarter every day.
One landing page, a few legal pages, and two forms (early-access waitlist, creator applications).

Stack: Next.js (App Router) + TypeScript + Tailwind CSS v4, Supabase for storage, PostHog for analytics, deployed on Vercel.

## What is in here

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero, how it works, topics, creators form, FAQ, final CTA |
| `/privacy`, `/terms`, `/delete-account` | Legal pages. **Placeholder text with visible TODO boxes for you to review.** `/delete-account` is required by Google Play |
| `/api/waitlist`, `/api/creators` | Form endpoints. Validate on the server, then insert into Supabase |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/twitter-image` | SEO and sharing, all generated |
| `/get` | Short link that redirects (temporarily) to the Play Store listing |
| `/about`, `/explainers/*` | Old article URLs. 301 redirect to `/` |
| `/v/[id]` | **Reserved** for future shareable video pages. Not built. Do not use this path for anything else |

All copy, links and flags live in one file: [`lib/content.ts`](lib/content.ts).

## Setup

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev                  # http://localhost:3000
```

### Environment variables

| Name | Required | Notes |
| --- | --- | --- |
| `SUPABASE_URL` | yes | Server only. Falls back to `NEXT_PUBLIC_SUPABASE_URL` (the old site used that name) |
| `SUPABASE_ANON_KEY` | yes | Server only. Falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The anon key is safe here because Row Level Security only allows INSERT |
| `POSTHOG_KEY` | no | PostHog project API key. Analytics is skipped when empty |
| `POSTHOG_HOST` | no | Defaults to `https://us.i.posthog.com`. Use `https://eu.i.posthog.com` for EU cloud |

## Supabase: create the tables (do this before launch)

The forms will show "Something went wrong" until these tables exist. Open **Supabase > SQL editor**, paste this and run it
(the same SQL is in [`supabase/001_waitlist_and_creators.sql`](supabase/001_waitlist_and_creators.sql)).

Security model: the website uses the anon key, which can **only INSERT**. There is no SELECT policy, so nobody can read
signups through the public key. View them in the Supabase dashboard (Table editor) or with the service role key.

```sql
-- Qrio marketing site: early-access waitlist and creator applications.
-- Run in the Supabase SQL editor. Safe to run once; uses IF NOT EXISTS.
--
-- Row Level Security: the website uses the anon key, which may only INSERT.
-- There is deliberately no SELECT/UPDATE/DELETE policy for anon, so signups can
-- only be read from the Supabase dashboard (or with the service role key).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- waitlist
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text,
  whatsapp    text,
  source      text,   -- utm_source
  campaign    text,   -- utm_campaign
  platform    text not null default 'other',
  constraint waitlist_contact_present check (email is not null or whatsapp is not null),
  constraint waitlist_platform_valid  check (platform in ('android', 'ios', 'other')),
  constraint waitlist_lengths         check (
    char_length(coalesce(email, ''))    <= 254 and
    char_length(coalesce(whatsapp, '')) <= 20  and
    char_length(coalesce(source, ''))   <= 100 and
    char_length(coalesce(campaign, '')) <= 100
  )
);

alter table public.waitlist enable row level security;

drop policy if exists "anon can insert waitlist" on public.waitlist;
create policy "anon can insert waitlist"
  on public.waitlist for insert
  to anon
  with check (true);

-- ---------------------------------------------------------------------------
-- creator_applications
-- ---------------------------------------------------------------------------
create table if not exists public.creator_applications (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  name             text   not null,
  instagram_handle text   not null,
  topics           text[] not null,
  whatsapp         text   not null,
  source           text,  -- utm_source
  constraint creator_topics_present check (cardinality(topics) >= 1),
  constraint creator_lengths        check (
    char_length(name)             <= 100 and
    char_length(instagram_handle) <= 31  and
    char_length(whatsapp)         <= 20  and
    char_length(coalesce(source, '')) <= 100
  )
);

alter table public.creator_applications enable row level security;

drop policy if exists "anon can insert creator applications" on public.creator_applications;
create policy "anon can insert creator applications"
  on public.creator_applications for insert
  to anon
  with check (true);

-- The anon role needs table-level INSERT too (RLS policies only filter rows).
grant insert on public.waitlist             to anon;
grant insert on public.creator_applications to anon;
```

Where the data goes: every early-access signup is a row in `waitlist`, every creator application is a row in
`creator_applications`. Both store `utm_source` / `utm_campaign` when the visitor arrived through a tagged link,
for example `https://qrioapp.in/?utm_source=instagram&utm_campaign=launch`.

## Going live: flipping `APP_LIVE`

1. Open `lib/content.ts` and set `export const APP_LIVE = true`. Check `PLAY_STORE_URL` is right.
2. Commit and push. Vercel redeploys automatically.

When `APP_LIVE` is `true`, every "Get early access" button becomes "Get it on Google Play". iPhone visitors
(detected from the user agent) still get the early-access modal, titled "iPhone coming soon", so you keep collecting iOS demand.
Also update the FAQ answer to "When does it launch?" in the same file.

## Analytics (PostHog)

No cookies, no banner. posthog-js loads lazily after the page is idle, uses localStorage, and has autocapture and session recording off.
Only these events are sent, with no emails or phone numbers:

| Event | Properties |
| --- | --- |
| `page_view` | `path` |
| `cta_click` | `location`: `header`, `hero` or `final` |
| `modal_open` | `location` |
| `waitlist_submit` | `platform`, `has_email`, `has_whatsapp` |
| `creator_form_submit` | `topic_count` |

## Before launch checklist

- [ ] Run the Supabase SQL above
- [ ] Set `SUPABASE_URL`, `SUPABASE_ANON_KEY` (and `POSTHOG_KEY`) in Vercel
- [ ] Review `/privacy`, `/terms`, `/delete-account` and remove the TODO boxes
- [ ] Fill `SOCIAL_LINKS` and confirm `CONTACT_EMAIL` in `lib/content.ts` (empty social links are hidden in the footer)
- [ ] Replace the placeholder favicon (`app/icon.svg`, `app/apple-icon.tsx`) with the final Qrio mark
- [ ] Submit the new sitemap in Search Console (the verification tag is already in `app/layout.tsx`)

## Deploy on Vercel

1. Import this repo in Vercel (framework: Next.js, no special build settings).
2. Add the environment variables above under **Settings > Environment Variables** for Production (and Preview if you want).
3. Push to `main`. Vercel builds and deploys on every push.
4. Domain: `qrioapp.in` should redirect to `www.qrioapp.in`, which is the canonical host used in `lib/content.ts`.

## Notes

- Spam protection is a hidden honeypot field on both forms. If you see abuse, add rate limiting (for example Vercel WAF or Upstash).
- The phone mockup and sample video cards are illustrative sample content, not real videos or people.
- Next.js here is v16, which differs from older versions. See `AGENTS.md` before changing framework-level code.
