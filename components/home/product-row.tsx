'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types'
import { ProductCard } from '@/components/catalog/product-card'
import { useLang } from '@/contexts/lang-context'

interface ProductRowProps {
  title: string
  products: Product[]
  viewAllHref?: string
}

export function ProductRow({ title, products, viewAllHref }: ProductRowProps) {
  if (products.length === 0) return null

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-[16px] font-bold" style={{ color: 'var(--color-text)' }}>
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-[13px] font-medium transition-opacity active:opacity-60"
            style={{ color: 'var(--color-gold)' }}
          >
            Все
            <ArrowRight size={13} />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-[160px] flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
