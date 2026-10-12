import { playStoreUrl } from '@/lib/content'

/**
 * Short link for posts and bios: qrioapp.in/get. Redirects to Google Play with
 * an install referrer. Add ?utm_source=instagram&utm_campaign=launch and those
 * tags are carried through, so Play Console shows where each install came from.
 * A route handler (not a config redirect) so the referrer keeps its encoding.
 */
export function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const target = playStoreUrl('short_link', {
    source: params.get('utm_source'),
    campaign: params.get('utm_campaign'),
  })
  return Response.redirect(target, 307)
}
