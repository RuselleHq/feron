'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { TopBar } from '@/components/layout/top-bar'
import { ProductCard } from '@/components/catalog/product-card'
import { useFavorites } from '@/contexts/favorites-context'
import { useLang } from '@/contexts/lang-context'
import { products } from '@/data/products'
import { categories } from '@/data/categories'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const { tr, lang } = useLang()
  const [filter, setFilter] = useState('all')

  const favProducts = useMemo(() => products.filter((p) => favorites.has(p.id)), [favorites])

  const chips = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of favProducts) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1)
    return [
      { id: 'all', label: tr.catalog.all, count: favProducts.length },
      ...categories
        .filter((c) => counts.has(c.id))
        .map((c) => ({ id: c.id, label: c.name[lang], count: counts.get(c.id) ?? 0 })),
    ]
  }, [favProducts, tr.catalog.all, lang])

  const visible = filter === 'all' ? favProducts : favProducts.filter((p) => p.categoryId === filter)

  return (
    <div className="page-enter min-h-screen" style={{ background: 'var(--bg)' }}>
      <TopBar title={tr.favorites.title} />

      {favProducts.length === 0 ? (
        <div className="flex flex-col items-center px-8 pt-24 gap-3">
          <Heart size={44} strokeWidth={1.2} style={{ color: 'var(--text-3)' }} />
          <p className="text-[16px] font-semibold" style={{ color: 'var(--text)' }}>
            {tr.favorites.empty}
          </p>
          <p className="text-[13px] text-center" style={{ color: 'var(--text-2)' }}>
            {tr.favorites.emptyDesc}
          </p>
          <Link
            href="/catalog"
            className="press mt-3 flex items-center justify-center px-6 text-[14px] font-semibold"
            style={{ height: 46, borderRadius: 'var(--r-full)', background: 'var(--gold)', color: '#1a1205' }}
          >
            {tr.nav.catalog}
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-4 pb-1" style={{ width: 'max-content' }}>
              {chips.map((chip) => {
                const active = chip.id === filter
                return (
                  <button
                    key={chip.id}
                    onClick={() => setFilter(chip.id)}
                    className="press flex items-center text-[12.5px] font-medium whitespace-nowrap"
                    style={{
                      height: 34,
                      paddingInline: 14,
                      borderRadius: 'var(--r-full)',
                      background: active ? '#ffffff' : 'var(--surface-2)',
                      border: `1px solid ${active ? '#ffffff' : 'var(--border)'}`,
                      color: active ? '#17171a' : 'var(--text-2)',
                    }}
                  >
                    {chip.label} ({chip.count})
                  </button>
                )
              })}
            </div>
          </div>

          <div className="px-4 pt-4 grid grid-cols-2 gap-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
