'use client'

import { TopBar } from '@/components/layout/top-bar'
import { ProductCard } from '@/components/catalog/product-card'
import { useFavorites } from '@/contexts/favorites-context'
import { useLang } from '@/contexts/lang-context'
import { products } from '@/data/products'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const { tr } = useLang()

  const favProducts = products.filter((p) => favorites.has(p.id))

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--color-bg)' }}>
      <TopBar title={tr.favorites.title} />

      <div className="px-4 pt-4 pb-6">
        {favProducts.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <Heart size={48} strokeWidth={1.2} style={{ color: 'var(--color-border)' }} />
            <p className="text-[16px] font-semibold" style={{ color: 'var(--color-text)' }}>
              {tr.favorites.empty}
            </p>
            <p className="text-[14px] text-center" style={{ color: 'var(--color-text-secondary)' }}>
              {tr.favorites.emptyDesc}
            </p>
            <Link
              href="/catalog"
              className="mt-2 px-6 py-3 rounded-2xl text-[14px] font-semibold text-white"
              style={{ background: 'var(--color-steel)' }}
            >
              {tr.nav.catalog}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
