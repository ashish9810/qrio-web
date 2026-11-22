import { after } from 'next/server'
import { Events } from '@/lib/analytics'
import { trackServer } from '@/lib/analytics-server'
import { playStoreUrl } from '@/lib/content'
import { PREVIEW_BOTS } from '@/lib/device'
import { clean, openAppPage, PREVIEW, previewPage, type Preview } from '@/lib/shortLink'
import { getSupabase } from '@/lib/supabase'

/**
 * Short link for posts and bios: qrioapp.in/get. Redirects to Google Play with
 * an install referrer. Add ?utm_source=instagram&utm_campaign=launch and those
 * tags are carried through, so Play Console shows where each install came from.
 * A route handler (not a config redirect) so the referrer keeps its encoding.
 *
 * Already have Qrio? On Android the verified link (public/.well-known/
 * assetlinks.json + the app's intent filter) opens the app directly, before
 * this page is ever requested. When it did not (in-app browsers such as
 * Instagram's, or the app is not installed), Android visitors get a small page
 * that tries to open the app and, if that does not work within about two
 * seconds, goes to Google Play with the same tags. Everyone else is
 * redirected to Play straight away.
 *
 * Link previews: WhatsApp, LinkedIn, X, Telegram and the like fetch the link
 * to build the preview card. If they were redirected they would show Google
 * Play's card, so they get a small page with Qrio's own title and image
 * (public/og/get.jpg, 1080x1080) instead. Everyone else is redirected as
 * before.
 *
 * One video: ?reel=<id> (the app's Share and Copy link). The app opens that
 * video when installed; otherwise Play, and after install the app reads the
 * id from the install referrer and opens it (deferred deep link). Link
 * previews show that video's thumbnail and caption.
 */
/** Title, caption and thumbnail of a published video, for its link preview. */
async function reelPreview(id: string): Promise<Preview | null> {
  try {
    const { data } = await getSupabase()
      .from('reels')
      .select('caption, thumb_url, status, creators(name)')
      .eq('id', id)
      .eq('status', 'published')
      .maybeSingle()
    if (!data) return null
    const creator = (data.creators as { name?: string } | null)?.name ?? 'Qrio'
    const caption = (data.caption ?? '').replace(/\s+/g, ' ').trim()
    // Title: the caption's first sentence (what the video is about).
    const first = caption.split(/(?<=[.!?])\s/)[0] ?? ''
    const title = first.length > 90 ? `${first.slice(0, 87)}…` : first
    return {
      title: title || `${creator} on Qrio`,
      description:
        creator === 'Qrio'
          ? 'Watch on Qrio. Short videos on geopolitics, business and startups.'
          : `by ${creator}. Watch on Qrio: short videos on geopolitics, business and startups.`,
      image: data.thumb_url as string,
      tall: true,
    }
  } catch {
    return null
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: Request) {
  const url = new URL(request.url)
  const params = url.searchParams
  const source = clean(params.get('utm_source'))
  const campaign = clean(params.get('utm_campaign'))
  const medium = clean(params.get('utm_medium'))
  const content = clean(params.get('utm_content'))
  // From the site's own buttons: where the button was and the visitor's
  // analytics id, so the install still credits that spot (see lib/appLink.ts).
  const from = (params.get('from') ?? '').replace(/[^a-z0-9_]/gi, '').slice(0, 30)
  const webId = (params.get('web_id') ?? '').replace(/[^a-f0-9]/gi, '').slice(0, 32)
  const reelParam = params.get('reel') ?? ''
  const reel = UUID.test(reelParam) ? reelParam.toLowerCase() : undefined
  const target = playStoreUrl(
    from || (reel ? 'share' : 'short_link'),
    { source, campaign, medium, content },
    webId || undefined,
    reel,
  )
  const ua = request.headers.get('user-agent') ?? ''
  if (PREVIEW_BOTS.test(ua)) {
    const p = reel ? await reelPreview(reel) : null
    return previewPage(target, p ?? PREVIEW, reel)
  }
  // One event per human click on the link: bio and shared links, video
  // shares, and the site's own buttons (from=...). Counted after the
  // redirect is sent, so it never slows it down.
  after(() =>
    trackServer(Events.shortLinkOpen, {
      via: from ? 'site_button' : reel ? 'video_share' : 'short_link',
      from: from || undefined,
      utm_source: source ?? undefined,
      utm_campaign: campaign ?? undefined,
      utm_medium: medium ?? undefined,
      utm_content: content ?? undefined,
      device: /android/i.test(ua) ? 'android' : /iphone|ipad|ipod/i.test(ua) ? 'ios' : 'other',
      country: request.headers.get('x-vercel-ip-country') ?? undefined,
      web_id: webId || undefined,
    }),
  )
  if (/android/i.test(ua)) {
    // Only the tags travel to the app; nothing else from the query string.
    const tags = new URLSearchParams()
    if (source) tags.set('utm_source', source.slice(0, 60))
    if (campaign) tags.set('utm_campaign', campaign.slice(0, 60))
    if (medium) tags.set('utm_medium', medium)
    if (content) tags.set('utm_content', content)
    if (reel) tags.set('reel', reel)
    const query = tags.toString() ? `?${tags}` : ''
    const intent =
      `intent://www.qrioapp.in/get${query}#Intent;scheme=https;package=com.qrio.qrio;` +
      `S.browser_fallback_url=${encodeURIComponent(target)};end`
    return openAppPage(intent, target)
  }
  return new Response(null, {
    status: 307,
    headers: { location: target, 'cache-control': 'no-store', vary: 'User-Agent' },
  })
}
