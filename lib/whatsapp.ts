import type { Product, ProductSize } from '@/types'
import { contacts } from '@/lib/contacts'

export interface WhatsAppOrder {
  customerName: string
  sizeType: 'standard' | 'custom'
  selectedSize?: ProductSize
  customWidth?: number
  customHeight?: number
  comment?: string
}

export function buildWhatsAppLink(order: WhatsAppOrder, product?: Product): string | null {
  const channel = contacts.whatsapp
  if (!channel) return null

  const sizeInfo =
    order.sizeType === 'standard' && order.selectedSize
      ? `Размер: ${order.selectedSize.label.ru}`
      : order.customWidth !== undefined && order.customHeight !== undefined
        ? `Размер: ${order.customWidth}×${order.customHeight} см`
        : ''

  const lines = [
    'Здравствуйте! Хочу заказать изделие.',
    product ? `Изделие: ${product.name.ru}` : '',
    `Имя: ${order.customerName}`,
    sizeInfo,
    order.comment ? `Комментарий: ${order.comment}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return `${channel.href}?text=${encodeURIComponent(lines)}`
}
