import type { Product, ProductSize } from '@/types'

export const SIZE_MIN_CM = 10
export const SIZE_MAX_CM = 3000

const ROUND_STEP = 500
const MIN_LENGTH_M = 0.5
const MAX_LENGTH_M = 100

export type PriceEstimate =
  | { kind: 'price'; amount: number }
  | { kind: 'on-request' }
  | { kind: 'invalid' }

interface Point {
  x: number
  y: number
}

export function isValidDimensionCm(value: number): boolean {
  return Number.isInteger(value) && value >= SIZE_MIN_CM && value <= SIZE_MAX_CM
}

export function supportsCalculator(product: Product): boolean {
  if (product.sizes.length === 0) return false
  return product.priceMethod === 'area' || product.priceMethod === 'length'
}

export function fixedCalculatorHeightCm(product: Product): number | null {
  if (product.priceMethod !== 'length') return null
  const heights = new Set(product.sizes.map((s) => s.height))
  return heights.size === 1 ? product.sizes[0].height : null
}

export function estimatePrice(product: Product, widthCm: number, heightCm: number): PriceEstimate {
  if (!isValidDimensionCm(widthCm) || !isValidDimensionCm(heightCm)) return { kind: 'invalid' }

  switch (product.priceMethod) {
    case 'area':
      return estimateByArea(product.sizes, widthCm, heightCm)
    case 'length':
      return estimateByLength(product.sizes, widthCm, heightCm)
    default:
      return { kind: 'on-request' }
  }
}

function areaM2(widthCm: number, heightCm: number): number {
  return (widthCm / 100) * (heightCm / 100)
}

function round(value: number): number {
  return Math.round(value / ROUND_STEP) * ROUND_STEP
}

function toPoints(raw: Point[]): Point[] {
  const cheapestByX = new Map<number, number>()
  for (const { x, y } of raw) {
    if (!(x > 0) || !(y > 0)) continue
    const current = cheapestByX.get(x)
    if (current === undefined || y < current) cheapestByX.set(x, y)
  }
  return [...cheapestByX.entries()]
    .map(([x, y]) => ({ x, y }))
    .sort((a, b) => a.x - b.x)
}

function interpolate(points: Point[], x: number): number | null {
  if (points.length < 2) return null

  const first = points[0]
  const last = points[points.length - 1]

  if (x <= first.x) {
    const next = points[1]
    const slope = (next.y - first.y) / (next.x - first.x)
    return first.y + slope * (x - first.x)
  }

  if (x >= last.x) {
    const previous = points[points.length - 2]
    const slope = (last.y - previous.y) / (last.x - previous.x)
    return last.y + slope * (x - last.x)
  }

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i]
    const b = points[i + 1]
    if (x >= a.x && x <= b.x) {
      return a.y + ((x - a.x) / (b.x - a.x)) * (b.y - a.y)
    }
  }

  return null
}

function priced(value: number | null): PriceEstimate {
  if (value === null || !Number.isFinite(value) || value <= 0) return { kind: 'on-request' }
  const amount = round(value)
  return amount > 0 ? { kind: 'price', amount } : { kind: 'on-request' }
}

function estimateByArea(sizes: ProductSize[], widthCm: number, heightCm: number): PriceEstimate {
  const points = toPoints(sizes.map((s) => ({ x: areaM2(s.width, s.height), y: s.priceFrom })))
  if (points.length === 0) return { kind: 'on-request' }

  const target = areaM2(widthCm, heightCm)

  if (points.length === 1) {
    const only = points[0]
    if (target < only.x * 0.75 || target > only.x * 1.25) return { kind: 'on-request' }
    return priced((only.y / only.x) * target)
  }

  const smallest = points[0].x
  const largest = points[points.length - 1].x
  if (target < smallest * 0.5 || target > largest * 2) return { kind: 'on-request' }

  return priced(interpolate(points, target))
}

function estimateByLength(sizes: ProductSize[], widthCm: number, heightCm: number): PriceEstimate {
  const lengthM = widthCm / 100
  if (lengthM < MIN_LENGTH_M || lengthM > MAX_LENGTH_M) return { kind: 'on-request' }

  const points = toPoints(sizes.map((s) => ({ x: s.height, y: s.priceFrom / (s.width / 100) })))
  if (points.length === 0) return { kind: 'on-request' }

  if (points.length === 1) return priced(points[0].y * lengthM)

  const lowest = points[0].x
  const highest = points[points.length - 1].x
  if (heightCm < lowest * 0.5 || heightCm > highest * 2) return { kind: 'on-request' }

  const perMetre = interpolate(points, heightCm)
  return priced(perMetre === null ? null : perMetre * lengthM)
}
