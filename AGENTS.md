<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Feron Craft — Agent Context

Мобильный сайт-каталог сварочной мастерской **Feron Craft** (Семей, Казахстан). Клиент смотрит изделия, выбирает размер, оставляет заявку → приходит в Telegram и WhatsApp. Цель — ощущение нативного мобильного приложения.

## Стек

| Что | Версия |
|-----|--------|
| Next.js App Router | 16.4.2 |
| React | 19 |
| TypeScript | — |
| Tailwind CSS | v4 |
| Embla Carousel | — |
| pnpm | workspace |
| Node.js | 22 LTS (`C:\Users\Thinkpad T14s\.local\node\node-v22.17.0-win-x64`) |

## Запуск dev-сервера

```powershell
# НЕ используй pnpm dev — выходит с кодом 255 в фоне
node .\node_modules\next\dist\bin\next dev
```

## Структура

```
app/
  layout.tsx              — root layout, провайдеры, <BottomNav>
  page.tsx                — главная (HeroBanner, CategoryStrip, ProductRow)
  catalog/
    page.tsx              — каталог с фильтрами
    [slug]/page.tsx       — детальная страница товара (CLIENT COMPONENT)
  favorites/page.tsx
  profile/page.tsx

components/
  layout/
    bottom-nav.tsx        — плавающий таббар (скрывается на /catalog/*)
    top-bar.tsx           — хедер (показывает "Feron Craft" если title не передан)
  home/
    hero-banner.tsx       — главный баннер (borderRadius: 18)
    category-strip.tsx
    product-row.tsx
  catalog/
    product-card.tsx      — карточка (aspect-[4/3], borderRadius: 14)
  product/
    product-gallery.tsx   — Embla галерея + Lightbox (свайп, fade 0.14s, миниатюры)
    price-calculator.tsx  — аккордеон-калькулятор (принимает open/onToggle)
  order/
    order-sheet.tsx       — bottom sheet заявки
  ui/
    icons.tsx             — кастомные SVG-иконки (IconGates, IconForge, и др.)

data/
  products.ts             — статические данные товаров
  categories.ts

lib/
  i18n.ts                 — переводы RU/KZ (tr.home.hero.title = 'Металлоизделия\nпод заказ')
  telegram.ts
  utils.ts                — cn(), calcPrice(), formatPrice()

contexts/
  lang-context.tsx        — useLang() — используется везде, 26 рёбер в графе
  favorites-context.tsx

public/
  images/products/        — PNG фото товаров (gate-01-1/2/3.png)
```

## Ключевые решения

**Изображения** — использовать `<img>` вместо `next/image`. Next.js блокирует SVG даже с `dangerouslyAllowSVG: true` + `unoptimized: true`.

**Роутинг** — `/catalog/[slug]` — это client component (`'use client'`). Slug читается через `useParams()`.

**BottomNav** — скрывается на `/catalog/.+` (продуктовая страница). Вместо него внизу кнопка «Оставить заявку».

**Размеры/аккордеоны** — `PriceCalculator` и блок sizes принимают `open` + `onToggle` снаружи (state в `[slug]/page.tsx`).

**Lightbox** — свайп через `onTouchStart/onTouchEnd` (порог 50px), fade через `opacity` + `setTimeout(140ms)`, без стрелок.

**Радиусы** — иерархия: 20px (nav pill) → 18px (hero) → 16px (header bottom) → 14px (карточки) → 12px (панели/кнопки) → 8px (малые кнопки).

**i18n** — `useLang()` из `contexts/lang-context.tsx`. Все строки в `lib/i18n.ts`. Языки: `ru` (по умолчанию) и `kz`.

## CSS-переменные (globals.css)

```css
--color-steel: #2D3142      /* основной тёмный */
--color-gold: #C8963E       /* акцент */
--color-bg: #FFFFFF
--color-surface: #F8F7F5
--color-text: #1A1A1A
--bottom-nav-height: 84px
```

## Переменные окружения (.env.local)

```
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_TELEGRAM_CHAT_ID=
NEXT_PUBLIC_WHATSAPP_PHONE=
NEXT_PUBLIC_PHONE=
```

## Правила для агентов

- Не трогай `aspect-[4/3]` у карточек — пользователь явно восстанавливал его.
- Не добавляй `next/image` для SVG — не работает, используй `<img>`.
- Не меняй заголовок hero banner — он `tr.home.hero.title` из i18n (`'Металлоизделия\nпод заказ'`).
- `TopBar` без `title` показывает "Feron Craft" — намеренно.
- Продуктовая страница — `'use client'`, не переделывай в server component.
- Не добавляй комментарии в код без явной просьбы.
