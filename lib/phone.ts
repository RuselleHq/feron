const KZ_DIGITS = /^7\d{10}$/

export function normalizeKzPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '')

  if (digits.length === 11 && digits.startsWith('8')) digits = `7${digits.slice(1)}`
  if (digits.length === 10 && digits.startsWith('7')) digits = `7${digits}`

  return KZ_DIGITS.test(digits) ? digits : null
}

export function formatKzPhone(digits: string): string {
  if (!KZ_DIGITS.test(digits)) return digits
  return `+${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`
}
