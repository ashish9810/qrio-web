import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renders article markdown with support for custom blocks:
 *
 * ```stats
 * 99% | Indian exports entering the UK at zero duty
 * ```
 *
 * ```bars
 * FIFA World Cup prize pool
 * Total prize money, US dollars
 * 2022 Qatar | 440 | $440M
 * 2026 USA | 871 | $871M
 * Source: FIFA figures via Forbes, July 2026
 * ```
 */

const BLOCK_PATTERN = /```(stats|bars|flow|timeline)[ \t]*\n([\s\S]*?)```/g

type Segment =
  | { kind: 'md'; text: string }
  | { kind: 'stats'; body: string }
  | { kind: 'bars'; body: string }
  | { kind: 'flow'; body: string }
  | { kind: 'timeline'; body: string }

function splitSegments(markdown: string): Segment[] {
  const segments: Segment[] = []
  let cursor = 0

  for (const match of markdown.matchAll(BLOCK_PATTERN)) {
    const before = markdown.slice(cursor, match.index).trim()
    if (before) segments.push({ kind: 'md', text: before })
    segments.push({
      kind: match[1] as 'stats' | 'bars' | 'flow' | 'timeline',
      body: match[2],
    })
    cursor = match.index + match[0].length
  }

  const rest = markdown.slice(cursor).trim()
  if (rest) segments.push({ kind: 'md', text: rest })
  return segments
}

function StatsBlock({ body }: { body: string }) {
  const rows = body
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.includes('|'))
    .map((l) => {
      const idx = l.indexOf('|')
      return { value: l.slice(0, idx).trim(), label: l.slice(idx + 1).trim() }
    })
    .filter((r) => r.value && r.label)

  if (rows.length === 0) return null

  return (
    <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      {rows.map((r, i) => (
        <div key={i} className="bg-card border border-line rounded-2xl px-5 py-5">
          <div className="text-[26px] font-bold text-accent tracking-tight leading-none">
            {r.value}
          </div>
          <div className="text-[13px] text-muted mt-2.5 leading-relaxed">
            {r.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function BarsBlock({ body }: { body: string }) {
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  let title: string | null = null
  let subtitle: string | null = null
  let source: string | null = null
  const data: { label: string; value: number; display: string }[] = []

  for (const line of lines) {
    const parts = line.split('|').map((p) => p.trim())
    const numeric = parts.length >= 2 ? Number(parts[1].replace(/,/g, '')) : NaN

    if (!Number.isNaN(numeric) && parts.length >= 2 && parts[1] !== '') {
      data.push({
        label: parts[0],
        value: numeric,
        display: parts.length >= 3 && parts[2] ? parts[2] : parts[1],
      })
    } else if (data.length === 0) {
      if (title === null) title = line
      else if (subtitle === null) subtitle = line
    } else if (source === null) {
      source = line
    }
  }

  if (data.length === 0) return null
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div className="not-prose bg-card border border-line rounded-2xl px-5 py-5 my-6">
      {title && <div className="text-[15px] font-bold text-ink">{title}</div>}
      {subtitle && <div className="text-xs text-muted mt-0.5">{subtitle}</div>}
      <div className={`space-y-3.5 ${title || subtitle ? 'mt-4' : ''}`}>
        {data.map((d, i) => {
          const fraction = max > 0 ? Math.min(d.value / max, 1) : 0
          const inside = fraction > 0.45
          return (
            <div key={i}>
              <div className="text-xs font-medium text-ink mb-1.5">{d.label}</div>
              <div className="flex items-center gap-2">
                <div
                  className="h-[30px] bg-accent rounded-md flex items-center justify-end px-2.5 min-w-[4px]"
                  style={{ width: `${Math.max(fraction * 100, 1)}%` }}
                >
                  {inside && (
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      {d.display}
                    </span>
                  )}
                </div>
                {!inside && (
                  <span className="text-xs font-bold text-ink whitespace-nowrap">
                    {d.display}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {source && <div className="text-[11px] text-muted mt-4">{source}</div>}
    </div>
  )
}

function FlowBlock({ body }: { body: string }) {
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return null
  const title = lines.length > 1 ? lines[0] : null
  const steps = lines.length > 1 ? lines.slice(1) : lines

  return (
    <div className="not-prose bg-[#F2EDE3] rounded-2xl px-5 py-5 my-6">
      {title && <div className="text-[15px] font-bold text-ink mb-3.5">{title}</div>}
      <div>
        {steps.map((step, i) => (
          <div key={i}>
            {i > 0 && (
              <div className="pl-5 py-1 text-accent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            )}
            <div className="flex items-center gap-2.5 bg-card border border-line rounded-xl px-3.5 py-3">
              <span className="w-[3px] h-[18px] bg-accent rounded-full shrink-0" />
              <span className="text-[13.5px] font-semibold text-ink leading-snug">{step}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineBlock({ body }: { body: string }) {
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  let title: string | null = null
  const rows: { date: string; text: string }[] = []

  for (const line of lines) {
    const idx = line.indexOf('|')
    if (idx > 0) {
      rows.push({ date: line.slice(0, idx).trim(), text: line.slice(idx + 1).trim() })
    } else if (rows.length === 0 && title === null) {
      title = line
    }
  }

  if (rows.length === 0) return null

  return (
    <div className="not-prose bg-[#F2EDE3] rounded-2xl px-5 py-5 my-6">
      {title && <div className="text-[15px] font-bold text-ink mb-4">{title}</div>}
      <div>
        {rows.map((r, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-accent-soft border-[2.5px] border-accent shrink-0" />
              {i < rows.length - 1 && <span className="w-[2px] flex-1 bg-accent-line" />}
            </div>
            <div className={i < rows.length - 1 ? 'pb-4' : ''}>
              <div className="text-[11px] font-bold tracking-wide text-accent uppercase">
                {r.date}
              </div>
              <div className="text-[13.5px] font-semibold text-ink leading-snug mt-0.5">
                {r.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ArticleMarkdown({ markdown }: { markdown: string }) {
  const segments = splitSegments(markdown)

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.kind === 'stats') return <StatsBlock key={i} body={seg.body} />
        if (seg.kind === 'bars') return <BarsBlock key={i} body={seg.body} />
        if (seg.kind === 'flow') return <FlowBlock key={i} body={seg.body} />
        if (seg.kind === 'timeline') return <TimelineBlock key={i} body={seg.body} />
        return (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
            {seg.text}
          </ReactMarkdown>
        )
      })}
    </>
  )
}
