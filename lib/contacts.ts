import { formatKzPhone, normalizeKzPhone } from '@/lib/phone'

export interface ContactChannel {
  value: string
  href: string
}

export interface Contacts {
  phone?: ContactChannel
  whatsapp?: ContactChannel
  telegram?: ContactChannel
  hasAny: boolean
}

const PLACEHOLDER_DIGITS = new Set(['77771234567', '7771234567', '7000000000', '77000000000'])
const PLACEHOLDER_HANDLES = new Set(['metalwork_semey'])

function isPlaceholder(value: string): boolean {
  const v = value.trim().toLowerCase()
  if (!v) return true
  if (v.startsWith('your_') || v.endsWith('_here') || v.includes('xxx')) return true
  if (PLACEHOLDER_HANDLES.has(v.replace(/^@/, ''))) return true

  const digits = v.replace(/\D/g, '')
  return digits.length > 0 && PLACEHOLDER_DIGITS.has(digits)
}

function clean(raw: string | undefined): string | undefined {
  const value = (raw ?? '').trim()
  return value && !isPlaceholder(value) ? value : undefined
}

function buildPhone(raw: string | undefined): ContactChannel | undefined {
  const value = clean(raw)
  if (!value) return undefined

  const digits = normalizeKzPhone(value)
  if (!digits) return undefined

  return { value: formatKzPhone(digits), href: `tel:+${digits}` }
}

function buildWhatsApp(raw: string | undefined): ContactChannel | undefined {
  const value = clean(raw)
  if (!value) return undefined

  const digits = normalizeKzPhone(value)
  if (!digits) return undefined

  return { value: formatKzPhone(digits), href: `https://wa.me/${digits}` }
}

function buildTelegram(raw: string | undefined): ContactChannel | undefined {
  const value = clean(raw)
  if (!value) return undefined

  const handle = value
    .replace(/^https?:\/\/t\.me\//i, '')
    .replace(/^@/, '')
    .replace(/\/+$/, '')

  if (!/^[A-Za-z0-9_]{5,32}$/.test(handle)) return undefined

  return { value: `@${handle}`, href: `https://t.me/${handle}` }
}

const phone = buildPhone(process.env.NEXT_PUBLIC_PHONE)
const whatsapp = buildWhatsApp(process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? process.env.NEXT_PUBLIC_PHONE)
const telegram = buildTelegram(process.env.NEXT_PUBLIC_TELEGRAM_USERNAME)

export const contacts: Contacts = {
  phone,
  whatsapp,
  telegram,
  hasAny: Boolean(phone || whatsapp || telegram),
}
