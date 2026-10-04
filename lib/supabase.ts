import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client for the form API routes. It uses the anon key,
 * so Row Level Security is what limits it: anon may INSERT into `waitlist` and
 * `creator_applications` and can never SELECT from them.
 *
 * SUPABASE_URL / SUPABASE_ANON_KEY are never exposed to the browser. The
 * NEXT_PUBLIC_ names are accepted as a fallback because the previous version
 * of this site used them.
 */
let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (client) return client

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are not set')
  }

  client = createClient(url, key, { auth: { persistSession: false } })
  return client
}
