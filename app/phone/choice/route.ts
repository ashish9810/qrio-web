import { after } from 'next/server'
import { Events } from '@/lib/analytics'
import { trackServer } from '@/lib/analytics-server'
import { clean } from '@/lib/shortLink'

const CHOICES = new Set(['play', 'whatsapp', 'waitlist'])
const DECISIONS = new Set(['ios', 'unsure', 'maybe_ipad'])

/**
 * Which button was tapped on the /phone page (sent with navigator.sendBeacon,
 * so the tap itself is never delayed). Counted as "Web Phone Page Choice".
 */
export async function POST(request: Request) {
  let form: URLSearchParams
  try {
    form = new URLSearchParams(await request.text())
  } catch {
    return new Response(null, { status: 204 })
  }
  const choice = form.get('choice') ?? ''
  const decision = form.get('decision') ?? ''
  if (CHOICES.has(choice) && DECISIONS.has(decision)) {
    after(() =>
      trackServer(Events.phonePageChoice, {
        choice,
        decision,
        from: (form.get('f') ?? '').replace(/[^a-z0-9_]/gi, '').slice(0, 30) || undefined,
        utm_source: clean(form.get('s')) ?? undefined,
        web_id: (form.get('w') ?? '').replace(/[^a-f0-9]/gi, '').slice(0, 32) || undefined,
      }),
    )
  }
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } })
}
