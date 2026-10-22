import type { OrderRequest, Product } from '@/types'

const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID

export async function sendOrderToTelegram(order: OrderRequest, product?: Product): Promise<boolean> {
  if (!BOT_TOKEN || !CHAT_ID) return false

  const sizeInfo =
    order.sizeType === 'standard' && order.selectedSize
      ? `📐 Размер: ${order.selectedSize.label.ru} (~${order.selectedSize.priceFrom.toLocaleString('ru-RU')} ₸)`
      : order.customWidth && order.customHeight
        ? `📐 Размер: ${order.customWidth} × ${order.customHeight} см (свой)`
        : '📐 Размер: не указан'

  const text = [
    `🔔 <b>Новая заявка</b>`,
    ``,
    `👤 <b>Клиент:</b> ${order.customerName}`,
    `📱 <b>Телефон:</b> ${order.phone}`,
    product ? `🔨 <b>Изделие:</b> ${product.name.ru}` : '',
    sizeInfo,
    order.comment ? `💬 <b>Комментарий:</b> ${order.comment}` : '',
    order.fileName ? `📎 <b>Файл:</b> ${order.fileName}` : '',
    ``,
    `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}`,
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    })
    return res.ok
  } catch {
    return false
  }
}
