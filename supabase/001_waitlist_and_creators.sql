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
