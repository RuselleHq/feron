'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import type { Product } from '@/types'
import { useLang } from '@/contexts/lang-context'
import { useFavorites } from '@/contexts/favorites-context'
import { cn, formatPrice } from '@/lib/utils'
import { CATEGORY_ICONS, IconHammer } from '@/components/ui/icons'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { lang, tr } = useLang()
  const { has, toggle } = useFavorites()
  const isFav = has(product.id)

  const minPrice = product.sizes.reduce((min, s) => Math.min(min, s.priceFrom), Infinity)

  return (
    <div
      className={cn('relative flex flex-col overflow-hidden', className)}
      style={{ borderRadius: 14, background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}
    >
      {/* Image */}
      <Link href={`/catalog/${product.slug}`} className="block aspect-[4/3] overflow-hidden" style={{ background: 'var(--color-bg-muted)' }}>
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name[lang]}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <ProductFallbackIcon categoryId={product.categoryId} />
        )}
      </Link>

      {/* Fav button */}
      <button
        onClick={() => toggle(product.id)}
        className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}
        aria-label={isFav ? tr.product.removeFromFavorites : tr.product.addToFavorites}
      >
        <Heart
          size={15}
          strokeWidth={2}
          style={{ color: isFav ? '#c0392b' : 'var(--color-text-muted)', fill: isFav ? '#c0392b' : 'none' }}
        />
      </button>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <Link href={`/catalog/${product.slug}`}>
          <p className="text-[13px] font-semibold leading-snug line-clamp-2" style={{ color: 'var(--color-text)' }}>
            {product.name[lang]}
          </p>
        </Link>
        <p className="text-[12px] font-medium" style={{ color: 'var(--color-gold)' }}>
          {minPrice === Infinity ? tr.common.priceOnRequest : `${tr.product.from} ${formatPrice(minPrice)}`}
        </p>
      </div>
    </div>
  )
}

function ProductFallbackIcon({ categoryId }: { categoryId: string }) {
  const Icon = CATEGORY_ICONS[categoryId]
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--color-bg-muted)' }}>
      {Icon
        ? <Icon size={36} color="var(--color-border)" strokeWidth={1.2} />
        : <IconHammer size={36} color="var(--color-border)" strokeWidth={1.2} />
      }
    </div>
  )
}
