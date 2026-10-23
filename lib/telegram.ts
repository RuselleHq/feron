import type { Product, ProductSize } from '@/types'
import { formatKzPhone } from '@/lib/phone'

const DEFAULT_API_BASE = 'https://api.telegram.org'
const REQUEST_TIMEOUT_MS = 15_000
const MAX_CAPTION_LENGTH = 900

export interface TelegramOrder {
  customerName: string
  phone: string
  product?: Product
  sizeType: 'standard' | 'custom'
  selectedSize?: ProductSize
  customWidth?: number
  customHeight?: number
  comment?: string
}

export interface TelegramAttachment {
  filename: string
  contentType: string
  bytes: ArrayBuffer
}

export type TelegramResult = { ok: true } | { ok: false; reason: 'not-configured' | 'rejected' | 'network' }

function apiBase(): string {
  return (process.env.TELEGRAM_API_BASE || DEFAULT_API_BASE).replace(/\/+$/, '')
}

function assertServer() {
  if (typeof window !== 'undefined') {
    throw new Error('lib/telegram.ts must never run in the browser')
  }
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
}

export function escapeTelegramHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildOrderMessage(order: TelegramOrder, attachmentName?: string): string {
  const esc = escapeTelegramHtml

  const sizeLine =
    order.sizeType === 'standard' && order.selectedSize
      ? `📐 <b>Размер:</b> ${esc(order.selectedSize.label.ru)} (~${order.selectedSize.priceFrom.toLocaleString('ru-RU')} ₸)`
      : order.customWidth !== undefined && order.customHeight !== undefined
        ? `📐 <b>Размер:</b> ${order.customWidth} × ${order.customHeight} см (свой)`
        : '📐 <b>Размер:</b> не указан'

  return [
    '🔔 <b>Новая заявка</b>',
    '',
    `👤 <b>Клиент:</b> ${esc(order.customerName)}`,
    `📱 <b>Телефон:</b> ${esc(formatKzPhone(order.phone))}`,
    order.product ? `🔨 <b>Изделие:</b> ${esc(order.product.name.ru)}` : '',
    sizeLine,
    order.comment ? `💬 <b>Комментарий:</b> ${esc(order.comment)}` : '',
    attachmentName ? `📎 <b>Файл:</b> ${esc(attachmentName)}` : '',
    '',
    `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export async function sendOrderToTelegram(
  order: TelegramOrder,
  attachment?: TelegramAttachment,
): Promise<TelegramResult> {
  assertServer()

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return { ok: false, reason: 'not-configured' }

  const text = buildOrderMessage(order, attachment?.filename)

  try {
    if (attachment && text.length <= MAX_CAPTION_LENGTH) {
      return await sendDocument(token, chatId, attachment, text)
    }

    const message = await callTelegram(token, 'sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    })
    if (!message.ok) return message

    if (!attachment) return { ok: true }

    return await sendDocument(token, chatId, attachment, `📎 Вложение к заявке: ${escapeTelegramHtml(order.customerName)}`)
  } catch {
    return { ok: false, reason: 'network' }
  }
}

async function sendDocument(
  token: string,
  chatId: string,
  attachment: TelegramAttachment,
  caption: string,
): Promise<TelegramResult> {
  const form = new FormData()
  form.append('chat_id', chatId)
  form.append('parse_mode', 'HTML')
  form.append('caption', caption)
  form.append('document', new Blob([attachment.bytes], { type: attachment.contentType }), attachment.filename)

  try {
    const res = await fetch(`${apiBase()}/bot${token}/sendDocument`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    return res.ok ? { ok: true } : { ok: false, reason: 'rejected' }
  } catch {
    return { ok: false, reason: 'network' }
  }
}

async function callTelegram(
  token: string,
  method: 'sendMessage',
  payload: Record<string, unknown>,
): Promise<TelegramResult> {
  try {
    const res = await fetch(`${apiBase()}/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    return res.ok ? { ok: true } : { ok: false, reason: 'rejected' }
  } catch {
    return { ok: false, reason: 'network' }
  }
}
