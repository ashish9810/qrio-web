import { sendGAEvent } from '@next/third-parties/google'

/**
 * Qrio website events. Keep names snake_case — GA4 convention — and stable,
 * since renaming one starts a fresh series in GA reports.
 */
export const QrioEvent = {
  /** Any "Get the app" / "Download Qrio" click. Param: location */
  appDownloadClick: 'app_download_click',
  /** Explainer page opened. Params: slug, category */
  articleView: 'article_view',
  /** Scrolled far enough to count as a real read. Params: slug, percent */
  articleRead: 'article_read',
  /** Topic card clicked on the homepage. Params: slug, category, position */
  topicCardClick: 'topic_card_click',
  /** "More from Qrio" link at the bottom of an article. Param: slug */
  relatedTopicClick: 'related_topic_click',
  /** Share button on an article. Params: network, slug */
  shareClick: 'share_click',
} as const

export type QrioEventName = (typeof QrioEvent)[keyof typeof QrioEvent]

export function track(
  event: QrioEventName,
  params: Record<string, string | number> = {}
) {
  if (typeof window === 'undefined') return

  // Events fired on mount can beat the GA script, and sendGAEvent drops them
  // when the queue is missing. gtag drains whatever is already queued once it
  // initialises, so make sure the queue exists first.
  const w = window as unknown as { dataLayer?: unknown[] }
  w.dataLayer ??= []

  sendGAEvent('event', event, params)
}
