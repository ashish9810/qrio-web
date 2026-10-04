import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { ERRORS } from '@/lib/content'
import { cleanPlatform, cleanTag, validateWaitlist } from '@/lib/validation'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: ERRORS.generic }, { status: 400 })
  }

  // Honeypot: real people never fill this hidden field. Pretend success to bots.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const result = validateWaitlist({
    email: typeof body.email === 'string' ? body.email : '',
    whatsapp: typeof body.whatsapp === 'string' ? body.whatsapp : '',
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  try {
    const { error } = await getSupabase().from('waitlist').insert({
      email: result.value.email,
      whatsapp: result.value.whatsapp,
      source: cleanTag(body.source),
      campaign: cleanTag(body.campaign),
      platform: cleanPlatform(body.platform),
    })
    if (error) throw error
  } catch (err) {
    console.error('waitlist insert failed', err)
    return NextResponse.json({ error: ERRORS.generic }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
