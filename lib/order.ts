import { z } from 'zod'
import { normalizeKzPhone } from '@/lib/phone'
import { SIZE_MAX_CM, SIZE_MIN_CM } from '@/lib/pricing'

export const MAX_FILE_BYTES = 4 * 1024 * 1024
export const MAX_FILE_MB = 4
export const ACCEPTED_FILE_EXTENSIONS = '.jpg,.jpeg,.png,.pdf'
export const MAX_COMMENT_LENGTH = 1000
export const MAX_NAME_LENGTH = 60

const NAME_CHARS = /^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі][A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі \-'’.]*$/

export interface OrderValidationMessages {
  nameRequired: string
  nameInvalid: string
  phoneRequired: string
  phoneInvalid: string
  sizeRequired: string
  dimensionsRequired: string
  dimensionsInvalid: string
  commentTooLong: string
}

export const defaultOrderValidationMessages: OrderValidationMessages = {
  nameRequired: 'Введите ваше имя',
  nameInvalid: 'Проверьте написание имени',
  phoneRequired: 'Введите номер телефона',
  phoneInvalid: 'Неверный формат номера',
  sizeRequired: 'Выберите или укажите размер',
  dimensionsRequired: 'Укажите ширину и высоту',
  dimensionsInvalid: `Размер должен быть целым числом от ${SIZE_MIN_CM} до ${SIZE_MAX_CM} см`,
  commentTooLong: 'Комментарий слишком длинный',
}

export function buildOrderSchema(
  messages: OrderValidationMessages = defaultOrderValidationMessages,
  options: { sizeCount: number } = { sizeCount: 0 },
) {
  return z
    .object({
      customerName: z
        .string()
        .trim()
        .min(2, messages.nameRequired)
        .max(MAX_NAME_LENGTH, messages.nameInvalid)
        .regex(NAME_CHARS, messages.nameInvalid),
      phone: z
        .string()
        .trim()
        .min(1, messages.phoneRequired)
        .refine((value) => normalizeKzPhone(value) !== null, messages.phoneInvalid),
      sizeType: z.enum(['standard', 'custom']),
      selectedSizeIndex: z.string().optional(),
      customWidth: z.string().optional(),
      customHeight: z.string().optional(),
      comment: z.string().trim().max(MAX_COMMENT_LENGTH, messages.commentTooLong).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.sizeType === 'standard') {
        if (options.sizeCount === 0) return
        const index = Number(data.selectedSizeIndex)
        const chosen =
          data.selectedSizeIndex !== undefined &&
          data.selectedSizeIndex !== '' &&
          Number.isInteger(index) &&
          index >= 0 &&
          index < options.sizeCount
        if (!chosen) {
          ctx.addIssue({ code: 'custom', message: messages.sizeRequired, path: ['selectedSizeIndex'] })
        }
        return
      }

      for (const key of ['customWidth', 'customHeight'] as const) {
        const raw = data[key]
        if (raw === undefined || raw.trim() === '') {
          ctx.addIssue({ code: 'custom', message: messages.dimensionsRequired, path: [key] })
          continue
        }
        const value = Number(raw)
        if (!Number.isInteger(value) || value < SIZE_MIN_CM || value > SIZE_MAX_CM) {
          ctx.addIssue({ code: 'custom', message: messages.dimensionsInvalid, path: [key] })
        }
      }
    })
}

export type OrderFormData = z.infer<ReturnType<typeof buildOrderSchema>>

export type OrderErrorCode =
  | 'validation'
  | 'file'
  | 'rate-limited'
  | 'not-configured'
  | 'telegram'
  | 'network'

export type OrderResponse = { ok: true } | { ok: false; code: OrderErrorCode }

export function isFileAllowed(file: File): 'ok' | 'too-large' | 'wrong-type' {
  if (file.size > MAX_FILE_BYTES) return 'too-large'

  const name = file.name.toLowerCase()
  const extensionOk = /\.(jpg|jpeg|png|pdf)$/.test(name)
  const typeOk = file.type === '' || ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)

  return extensionOk && typeOk ? 'ok' : 'wrong-type'
}
