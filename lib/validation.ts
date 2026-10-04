import { CREATOR_TOPICS, ERRORS } from './content'

/**
 * Validation and normalisation shared by the client forms and the API routes,
 * so both sides always agree on what a valid submission looks like.
 */

export type Platform = 'android' | 'ios' | 'other'

export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

export function normaliseEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase()
  if (email.length > 254) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}

/**
 * Digits only, stored with a leading "+". A bare 10 digit number is treated as
 * Indian and gets +91. Returns null if it is not 10 to 15 digits.
 */
export function normaliseWhatsapp(raw: string): string | null {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.length < 10 || digits.length > 15) return null
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 11 && digits.startsWith('0')) return `+91${digits.slice(1)}`
  return `+${digits}`
}

/** Strips spaces, accepts a pasted profile URL, and ensures one leading "@". */
export function normaliseInstagram(raw: string): string | null {
  let handle = raw.trim()
  const fromUrl = handle.match(/instagram\.com\/([A-Za-z0-9._]+)/i)
  if (fromUrl) handle = fromUrl[1]
  handle = handle.replace(/\s+/g, '').replace(/^@+/, '')
  return /^[A-Za-z0-9._]{1,30}$/.test(handle) ? `@${handle}` : null
}

export type WaitlistInput = { email?: string; whatsapp?: string }
export type WaitlistValue = { email: string | null; whatsapp: string | null }

export function validateWaitlist(input: WaitlistInput): Result<WaitlistValue> {
  const rawEmail = (input.email ?? '').trim()
  const rawPhone = (input.whatsapp ?? '').trim()

  if (!rawEmail && !rawPhone) return { ok: false, error: ERRORS.waitlistEmpty }

  let email: string | null = null
  let whatsapp: string | null = null

  if (rawEmail) {
    email = normaliseEmail(rawEmail)
    if (!email) return { ok: false, error: ERRORS.email }
  }
  if (rawPhone) {
    whatsapp = normaliseWhatsapp(rawPhone)
    if (!whatsapp) return { ok: false, error: ERRORS.phone }
  }
  return { ok: true, value: { email, whatsapp } }
}

export type CreatorInput = {
  name?: string
  instagram?: string
  topics?: string[]
  whatsapp?: string
}
export type CreatorValue = {
  name: string
  instagram_handle: string
  topics: string[]
  whatsapp: string
}

export function validateCreator(input: CreatorInput): Result<CreatorValue> {
  const name = (input.name ?? '').trim()
  const rawInsta = (input.instagram ?? '').trim()
  const rawPhone = (input.whatsapp ?? '').trim()
  const topics = Array.isArray(input.topics) ? input.topics : []

  if (!name || !rawInsta || !rawPhone || topics.length === 0) {
    return { ok: false, error: ERRORS.creatorMissing }
  }
  if (name.length > 100) return { ok: false, error: ERRORS.creatorMissing }

  const allowed = new Set<string>(CREATOR_TOPICS)
  if (!topics.every((t) => allowed.has(t))) {
    return { ok: false, error: ERRORS.creatorMissing }
  }

  const whatsapp = normaliseWhatsapp(rawPhone)
  if (!whatsapp) return { ok: false, error: ERRORS.phone }

  const instagram_handle = normaliseInstagram(rawInsta)
  if (!instagram_handle) return { ok: false, error: ERRORS.instagram }

  return {
    ok: true,
    value: { name, instagram_handle, topics: [...new Set(topics)], whatsapp },
  }
}

/** Trims and caps a UTM value; empty becomes null. */
export function cleanTag(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const v = value.trim().slice(0, 100)
  return v || null
}

export function cleanPlatform(value: unknown): Platform {
  return value === 'android' || value === 'ios' ? value : 'other'
}
