'use client'

import { useState } from 'react'
import { CREATORS, CREATOR_TOPICS, ERRORS } from '@/lib/content'
import { Events, track } from '@/lib/analytics'
import { getUtm } from '@/lib/utm'
import { validateCreator } from '@/lib/validation'

export default function CreatorForm() {
  const [name, setName] = useState('')
  const [instagram, setInstagram] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [whatsapp, setWhatsapp] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const f = CREATORS.form

  function toggleTopic(topic: string) {
    setTopics((current) =>
      current.includes(topic) ? current.filter((t) => t !== topic) : [...current, topic],
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (sending) return

    const result = validateCreator({ name, instagram, topics, whatsapp })
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError('')
    setSending(true)

    try {
      const res = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          instagram,
          topics,
          whatsapp,
          company,
          source: getUtm().source,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? ERRORS.generic)
        setSending(false)
        return
      }
      track(Events.creatorFormSubmit, { topic_count: topics.length })
      setDone(true)
    } catch {
      setError(ERRORS.generic)
      setSending(false)
    }
  }

  if (done) {
    return (
      <div
        className="rounded-2xl bg-card p-7 font-medium text-deep shadow-[0_20px_50px_rgba(20,20,43,0.08)]"
        role="status"
      >
        {f.success}
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid gap-3.5 rounded-3xl bg-card p-[30px] shadow-[0_20px_50px_rgba(20,20,43,0.08)]"
    >
      <label className="grid gap-1.5 text-sm font-medium">
        {f.name}
        <input
          type="text"
          autoComplete="name"
          className="field"
          placeholder={f.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="grid gap-1.5 text-sm font-medium">
        {f.instagram}
        <input
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          className="field"
          placeholder={f.instagramPlaceholder}
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
      </label>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">
          {f.topics} <span className="font-normal text-muted">{f.topicsHint}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {CREATOR_TOPICS.map((topic) => (
            <label key={topic} className="topic-pill">
              <input
                type="checkbox"
                name="topic"
                value={topic}
                checked={topics.includes(topic)}
                onChange={() => toggleTopic(topic)}
              />
              <span>{topic}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-1.5 text-sm font-medium">
        {f.whatsapp}
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="field"
          placeholder={f.whatsappPlaceholder}
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </label>

      <div className="hp" aria-hidden="true">
        <label>
          Company
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      <div className="form-error" role="alert">
        {error}
      </div>
      <button type="submit" className="btn w-full" disabled={sending}>
        {sending ? f.sending : f.submit}
      </button>
    </form>
  )
}
