import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { products } from '@/data/products'
import { buildOrderSchema, MAX_FILE_BYTES, type OrderErrorCode, type OrderResponse } from '@/lib/order'
import { normalizeKzPhone } from '@/lib/phone'
import { isTelegramConfigured, sendOrderToTelegram, type TelegramAttachment } from '@/lib/telegram'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RATE_WINDOW_MS = 10 * 60_000
const RATE_MAX_REQUESTS = 5
const DEDUPE_TTL_MS = 10 * 60_000
const MAX_TRACKED_KEYS = 2000

const rateBuckets = new Map<string, number[]>()
const completedRequests = new Map<string, number>()

function fail(code: OrderErrorCode, status: number) {
  return NextResponse.json<OrderResponse>({ ok: false, code }, { status })
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const first = forwarded?.split(',')[0]?.trim()
  return first || request.headers.get('x-real-ip')?.trim() || 'unknown'
}

function prune(map: Map<string, unknown>) {
  if (map.size <= MAX_TRACKED_KEYS) return
  const excess = map.size - MAX_TRACKED_KEYS
  let removed = 0
  for (const key of map.keys()) {
    map.delete(key)
    removed += 1
    if (removed >= excess) break
  }
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const hits = (rateBuckets.get(key) ?? []).filter((at) => now - at < RATE_WINDOW_MS)

  if (hits.length >= RATE_MAX_REQUESTS) {
    rateBuckets.set(key, hits)
    return true
  }

  hits.push(now)
  rateBuckets.set(key, hits)
  prune(rateBuckets)
  return false
}

function alreadyDelivered(requestId: string | undefined): boolean {
  if (!requestId) return false
  const now = Date.now()

  for (const [key, at] of completedRequests) {
    if (now - at > DEDUPE_TTL_MS) completedRequests.delete(key)
  }

  return completedRequests.has(requestId)
}

function sniffContentType(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png'
  }
  if (
    bytes.length >= 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  ) {
    return 'application/pdf'
  }
  return null
}

function safeFileName(raw: string, contentType: string): string {
  const base = raw.split(/[\\/]/).pop() ?? ''
  const stem = base
    .replace(/\.[^.]*$/, '')
    .replace(/[^A-Za-z0-9А-Яа-яЁё _.-]/g, '_')
    .replace(/^[._\s]+/, '')
    .trim()
    .slice(0, 60)

  const extension =
    contentType === 'application/pdf' ? 'pdf' : contentType === 'image/png' ? 'png' : 'jpg'

  return `${stem || 'vlozhenie'}.${extension}`
}

function readString(form: FormData, key: string): string | undefined {
  const value = form.get(key)
  return typeof value === 'string' ? value : undefined
}

export async function POST(request: NextRequest) {
  if (!isTelegramConfigured()) return fail('not-configured', 503)

  const key = clientKey(request)
  if (isRateLimited(key)) return fail('rate-limited', 429)

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return fail('validation', 400)
  }

  const requestId = readString(form, 'requestId')?.slice(0, 100)
  if (alreadyDelivered(requestId)) {
    return NextResponse.json<OrderResponse>({ ok: true })
  }

  const productId = readString(form, 'productId')
  const product = productId ? products.find((p) => p.id === productId) : undefined
  if (productId && !product) return fail('validation', 400)

  const parsed = buildOrderSchema(undefined, { sizeCount: product?.sizes.length ?? 0 }).safeParse({
    customerName: readString(form, 'customerName') ?? '',
    phone: readString(form, 'phone') ?? '',
    sizeType: readString(form, 'sizeType') ?? 'standard',
    selectedSizeIndex: readString(form, 'selectedSizeIndex'),
    customWidth: readString(form, 'customWidth'),
    customHeight: readString(form, 'customHeight'),
    comment: readString(form, 'comment'),
  })

  if (!parsed.success) return fail('validation', 400)

  const data = parsed.data
  const phone = normalizeKzPhone(data.phone)
  if (!phone) return fail('validation', 400)

  let attachment: TelegramAttachment | undefined
  const uploaded = form.get('file')

  if (uploaded instanceof File && uploaded.size > 0) {
    if (uploaded.size > MAX_FILE_BYTES) return fail('file', 413)

    const bytes = await uploaded.arrayBuffer()
    const contentType = sniffContentType(new Uint8Array(bytes.slice(0, 8)))
    if (!contentType) return fail('file', 415)

    attachment = {
      filename: safeFileName(uploaded.name, contentType),
      contentType,
      bytes,
    }
  }

  const selectedSize =
    data.sizeType === 'standard' && product && data.selectedSizeIndex
      ? product.sizes[Number(data.selectedSizeIndex)]
      : undefined

  const result = await sendOrderToTelegram(
    {
      customerName: data.customerName,
      phone,
      product,
      sizeType: data.sizeType,
      selectedSize,
      customWidth: data.sizeType === 'custom' ? Number(data.customWidth) : undefined,
      customHeight: data.sizeType === 'custom' ? Number(data.customHeight) : undefined,
      comment: data.comment || undefined,
    },
    attachment,
  )

  if (!result.ok) {
    console.error(`[order] delivery failed: ${result.reason}`)
    if (result.reason === 'not-configured') return fail('not-configured', 503)
    return fail('telegram', 502)
  }

  if (requestId) {
    completedRequests.set(requestId, Date.now())
    prune(completedRequests)
  }

  return NextResponse.json<OrderResponse>({ ok: true })
}
