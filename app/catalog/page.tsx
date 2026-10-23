'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { TopBar, RoundButton } from '@/components/layout/top-bar'
import { CategoryStrip } from '@/components/home/category-strip'
import { ProductCard } from '@/components/catalog/product-card'
import { products } from '@/data/products'
import { useLang } from '@/contexts/lang-context'
import { IconSearch } from '@/components/ui/icons'

function CatalogContent() {
  const { tr, lang } = useLang()
  const searchParams = useSearchParams()
  const initialCategory = searchParams?.get('category') ?? 'all'
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const byCategory = activeCategory === 'all' || p.categoryId === activeCategory
      const byQuery = q === '' || p.name[lang].toLowerCase().includes(q) || p.name.ru.toLowerCase().includes(q)
      return byCategory && byQuery
    })
  }, [activeCategory, query, lang])

  return (
    <div className="page-enter min-h-screen" style={{ background: 'var(--bg)' }}>
      <TopBar
        title={tr.catalog.title}
        action={
          <RoundButton
            label={tr.catalog.searchPlaceholder}
            onClick={() => {
              setSearchOpen((v) => !v)
              if (searchOpen) setQuery('')
            }}
          >
            {searchOpen ? (
              <X size={18} color="var(--text)" />
            ) : (
              <Search size={18} color="var(--text)" strokeWidth={1.9} />
            )}
          </RoundButton>
        }
      />

      {searchOpen && (
        <div className="px-4 pb-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr.catalog.searchPlaceholder}
            className="field"
          />
        </div>
      )}

      <CategoryStrip
        variant="filter"
        activeId={activeCategory}
        onSelect={setActiveCategory}
        allLabel={tr.catalog.all}
      />

      <div className="px-4 pt-4 flex flex-col gap-3.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <IconSearch size={38} strokeWidth={1.2} color="var(--text-3)" />
            <p className="text-[14px]" style={{ color: 'var(--text-2)' }}>
              {tr.catalog.empty}
            </p>
          </div>
        ) : (
          filtered.map((product) => <ProductCard key={product.id} product={product} variant="wide" />)
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div style={{ background: 'var(--bg)', minHeight: '100vh' }} />}>
      <CatalogContent />
    </Suspense>
  )
}
