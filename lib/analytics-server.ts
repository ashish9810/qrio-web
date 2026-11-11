import { MIXPANEL_TOKEN } from './analytics'

/**
 * Sends one event to Mixpanel from the server (for redirects such as /get,
 * where no page loads and the browser library never runs). Best effort: a
 * failure is ignored so it can never break the redirect. Call inside after().
 */
export async function trackServer(event: string, props: Record<string, string | number | boolean | undefined>) {
  const id = crypto.randomUUID()
  const properties = Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined && v !== ''))
  const data = JSON.stringify([
    {
      event,
      properties: {
        token: MIXPANEL_TOKEN,
        time: Date.now(),
        $insert_id: id,
        distinct_id: props.web_id ? `web:${props.web_id}` : `get:${id}`,
        platform: 'web',
        ...properties,
      },
    },
  ])
  try {
    await fetch('https://api-js.mixpanel.com/track?ip=0', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(Buffer.from(data).toString('base64'))}`,
    })
  } catch {
    // Analytics must never break the redirect.
  }
}
