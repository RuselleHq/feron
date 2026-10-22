'use client'

import { Suspense, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { TopBar } from '@/components/layout/top-bar'
import { ProductCard } from '@/components/catalog/product-card'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { useLang } from '@/contexts/lang-context'
import { cn } from '@/lib/utils'
import { CATEGORY_ICONS, IconSearch } from '@/components/ui/icons'

function CatalogContent() {
  const { tr, lang } = useLang()
  const searchParams = useSearchParams()
  const initialCategory = searchParams?.get('category') ?? 'all'
  const [activeCategory, setActiveCategory] = useState(initialCategory)

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products
    return products.filter((p) => p.categoryId === activeCategory)
  }, [activeCategory])

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--color-bg)' }}>
      <TopBar title={tr.catalog.title} />

      {/* Category filter */}
      <div className="overflow-x-auto scrollbar-hide sticky top-[52px] z-30 py-2" style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="flex gap-2 px-4" style={{ width: 'max-content' }}>
          <FilterChip
            label={tr.catalog.all}
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id]
            return (
              <FilterChip
                key={cat.id}
                label={cat.name[lang]}
                icon={Icon ? <Icon size={14} strokeWidth={1.6} /> : undefined}
                active={activeCategory === cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
              />
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 pt-4 pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-2">
            <IconSearch size={40} strokeWidth={1.2} color="var(--color-border)" />
            <p className="text-[15px]" style={{ color: 'var(--color-text-secondary)' }}>
              {tr.catalog.empty}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--color-bg)', minHeight: '100vh' }} />}>
      <CatalogContent />
    </Suspense>
  )
}

function FilterChip({ label, icon, active, onClick }: { label: string; icon?: ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all active:scale-95',
      )}
      style={{
        background: active ? 'var(--color-steel)' : 'var(--color-bg-muted)',
        color: active ? 'white' : 'var(--color-text-secondary)',
      }}
    >
      {icon && <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>}
      {label}
    </button>
  )
}
