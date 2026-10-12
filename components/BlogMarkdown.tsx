import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Renders a post body. External links open in a new tab and are marked noopener. */
export default function BlogMarkdown({ children }: { children: string }) {
  return (
    <div className="prose-qrio">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: label }) => {
            const external = typeof href === 'string' && /^https?:\/\//.test(href)
            return external ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ) : (
              <a href={href}>{label}</a>
            )
          },
          table: ({ children: rows }) => (
            <div className="prose-table">
              <table>{rows}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
