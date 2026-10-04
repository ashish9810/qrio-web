export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <article className="mx-auto max-w-[720px] px-5 py-16 md:py-24">
      <h1 className="font-serif text-[clamp(34px,5vw,48px)] leading-[1.1] font-medium tracking-[-0.02em]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
      <div className="mt-10 space-y-5 text-base [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-[26px] [&_h2]:font-medium [&_li]:ml-5 [&_li]:list-disc [&_a]:text-accent [&_a]:underline">
        {children}
      </div>
    </article>
  )
}
