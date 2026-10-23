'use client'

import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import type { Product } from '@/types'
import { useLang } from '@/contexts/lang-context'
import { useFavorites } from '@/contexts/favorites-context'
import { cn, formatPrice } from '@/lib/utils'
import { CATEGORY_ICONS, IconHammer } from '@/components/ui/icons'

interface ProductCardProps {
  product: Product
  /** 'wide' — full-width catalog card with text over the image; 'grid' — two-column card */
  variant?: 'wide' | 'grid'
  className?: string
}

export function ProductCard({ product, variant = 'wide', className }: ProductCardProps) {
  const { lang, tr } = useLang()
  const { has, toggle } = useFavorites()
  const isFav = has(product.id)

  const minPrice = product.sizes.reduce((min, s) => Math.min(min, s.priceFrom), Infinity)
  const priceLabel =
    minPrice === Infinity ? tr.common.priceOnRequest : `${tr.product.from} ${formatPrice(minPrice)}`
  const image = product.images[0]

  const favButton = (
    <button
      onClick={(e) => {
        e.preventDefault()
        toggle(product.id)
      }}
      aria-label={isFav ? tr.product.removeFromFavorites : tr.product.addToFavorites}
      className="press absolute flex items-center justify-center"
      style={{
        top: 12,
        right: 12,
        width: 34,
        height: 34,
        borderRadius: 'var(--r-full)',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Heart
        size={17}
        strokeWidth={2}
        color={isFav ? '#e5484d' : '#3a3a40'}
        fill={isFav ? '#e5484d' : 'none'}
      />
    </button>
  )

  if (variant === 'grid') {
    return (
      <div
        className={cn('relative overflow-hidden', className)}
        style={{ borderRadius: 'var(--r-md)', background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <Link href={`/catalog/${product.slug}`} className="block aspect-[4/3] overflow-hidden">
          {image ? (
            <img src={image} alt={product.name[lang]} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <FallbackArt categoryId={product.categoryId} size={34} />
          )}
        </Link>
        {favButton}
        <Link href={`/catalog/${product.slug}`} className="block px-3 pt-2.5 pb-3">
          <p className="text-[12.5px] font-semibold leading-snug line-clamp-2" style={{ color: 'var(--text)' }}>
            {product.name[lang]}
          </p>
          <p className="text-[12px] font-semibold mt-1" style={{ color: 'var(--gold)' }}>
            {priceLabel}
          </p>
        </Link>
      </div>
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ borderRadius: 'var(--r-lg)', background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <Link href={`/catalog/${product.slug}`} className="block relative aspect-[3/2] overflow-hidden">
        {image ? (
          <img src={image} alt={product.name[lang]} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <FallbackArt categoryId={product.categoryId} size={52} />
        )}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: '62%',
            background: 'linear-gradient(180deg, rgba(10,10,11,0) 0%, rgba(10,10,11,0.72) 52%, rgba(10,10,11,0.93) 100%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-3.5">
          <div className="min-w-0">
            <p className="text-[15px] font-bold leading-snug line-clamp-2" style={{ color: '#fff' }}>
              {product.name[lang]}
            </p>
            <p className="text-[13px] font-semibold mt-1" style={{ color: 'var(--gold-soft)' }}>
              {priceLabel}
            </p>
          </div>
          <span
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 42, height: 42, borderRadius: 'var(--r-full)', background: 'var(--gold)' }}
          >
            <ArrowRight size={19} color="#1a1205" strokeWidth={2.2} />
          </span>
        </div>
      </Link>
      {favButton}
    </div>
  )
}

function FallbackArt({ categoryId, size }: { categoryId: string; size: number }) {
  const Icon = CATEGORY_ICONS[categoryId] ?? IconHammer
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'linear-gradient(145deg, #1b1b1e 0%, #121214 100%)' }}
    >
      <Icon size={size} color="rgba(255,255,255,0.13)" strokeWidth={1.2} />
    </div>
  )
}
