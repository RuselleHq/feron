import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString('ru-RU') + ' ₸'
}

export function calcPrice(pricePerSqM: number, widthCm: number, heightCm: number): number {
  const sqM = (widthCm / 100) * (heightCm / 100)
  return Math.round(sqM * pricePerSqM)
}
