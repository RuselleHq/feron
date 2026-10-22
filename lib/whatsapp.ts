import type { OrderRequest, Product } from '@/types'

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '77771234567'

export function buildWhatsAppLink(order: OrderRequest, product?: Product): string {
  const sizeInfo =
    order.sizeType === 'standard' && order.selectedSize
      ? `Размер: ${order.selectedSize.label.ru}`
      : order.customWidth && order.customHeight
        ? `Размер: ${order.customWidth}×${order.customHeight} см`
        : ''

  const lines = [
    `Здравствуйте! Хочу заказать изделие.`,
    product ? `Изделие: ${product.name.ru}` : '',
    `Имя: ${order.customerName}`,
    sizeInfo,
    order.comment ? `Комментарий: ${order.comment}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines)}`
}
