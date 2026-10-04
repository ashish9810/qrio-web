import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { ERRORS } from '@/lib/content'
import { cleanTag, validateCreator } from '@/lib/validation'

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

  const result = validateCreator({
    name: typeof body.name === 'string' ? body.name : '',
    instagram: typeof body.instagram === 'string' ? body.instagram : '',
    topics: Array.isArray(body.topics)
      ? body.topics.filter((t): t is string => typeof t === 'string')
      : [],
    whatsapp: typeof body.whatsapp === 'string' ? body.whatsapp : '',
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  try {
    const { error } = await getSupabase()
      .from('creator_applications')
      .insert({ ...result.value, source: cleanTag(body.source) })
    if (error) throw error
  } catch (err) {
    console.error('creator application insert failed', err)
    return NextResponse.json({ error: ERRORS.generic }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
