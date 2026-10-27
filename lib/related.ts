/**
 * Cross-links between the blog and the story archive, so readers (and search
 * engines) can move between the two. Ranks candidates by how many meaningful
 * words they share with the page; ties and no-overlap fall back to the newest.
 */

const STOP = new Set(
  'about after again also among and are because been before being between both but can could does doing down each from further have having here how into its just like more most much must not now off once only other our out over own same should some such than that the their them then there these they this those through too under until very was were what when where which while who whom why will with would you your news india indian'.split(' '),
)

function words(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP.has(w)),
  )
}

/** Up to `count` items most related to `text`. `date` is used to break ties (newest first). */
export function mostRelated<T>(
  text: string,
  items: T[],
  textOf: (item: T) => string,
  dateOf: (item: T) => string,
  count = 2,
): T[] {
  const target = words(text)
  return items
    .map((item) => {
      let score = 0
      for (const w of words(textOf(item))) if (target.has(w)) score++
      return { item, score }
    })
    .sort((a, b) => b.score - a.score || dateOf(b.item).localeCompare(dateOf(a.item)))
    .slice(0, count)
    .map((r) => r.item)
}
