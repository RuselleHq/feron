'use client'

import { notFound, useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, Share2, ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import { ProductGallery } from '@/components/product/product-gallery'
import { PriceCalculator } from '@/components/product/price-calculator'
import { OrderSheet } from '@/components/order/order-sheet'
import { products } from '@/data/products'
import { useLang } from '@/contexts/lang-context'
import { useFavorites } from '@/contexts/favorites-context'
import { formatPrice } from '@/lib/utils'
import { supportsCalculator } from '@/lib/pricing'

const Product3dViewer = dynamic(
  () => import('@/components/product/product-3d-viewer').then((m) => m.Product3dViewer),
  { ssr: false }
)

export default function ProductPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const { lang, tr } = useLang()
  const { has, toggle } = useFavorites()
  const isFav = has(product.id)
  const [orderOpen, setOrderOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)
  const [sizeIndex, setSizeIndex] = useState<number | undefined>(product.sizes.length > 0 ? 0 : undefined)
  const canCalculate = supportsCalculator(product)

  const minPrice = product.sizes.length > 0
    ? product.sizes.reduce((min, s) => Math.min(min, s.priceFrom), Infinity)
    : null

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product!.name[lang], url: window.location.href }).catch(() => {})
    }
  }

  return (
    <>
      <div className="min-h-screen page-enter" style={{ background: 'var(--bg)' }}>
        <div className="relative">
          <ProductGallery images={product.images} name={product.name[lang]} categoryId={product.categoryId} />

          <div
            className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none z-10"
            style={{ paddingTop: 'calc(14px + env(safe-area-inset-top, 0px))' }}
          >
            <Link href="/catalog" className="pointer-events-auto press" style={floatingButton}>
              <ArrowLeft size={18} color="#fff" strokeWidth={2} />
            </Link>
            <div className="flex gap-2 pointer-events-auto">
              <button onClick={handleShare} style={floatingButton} className="press" aria-label={tr.product.share}>
                <Share2 size={16} color="#fff" strokeWidth={2} />
              </button>
              <button
                onClick={() => toggle(product.id)}
                style={floatingButton}
                className="press"
                aria-label={isFav ? tr.product.removeFromFavorites : tr.product.addToFavorites}
              >
                <Heart size={16} strokeWidth={2} color={isFav ? '#e5484d' : '#fff'} fill={isFav ? '#e5484d' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {product.model3d && (
          <div className="px-4 mt-4">
            <Product3dViewer modelPath={product.model3d} />
          </div>
        )}

        {/* relative+z-index keeps the title above the gallery's bottom fade */}
        <div className="px-4 relative" style={{ paddingBottom: 110, marginTop: -16, zIndex: 1 }}>
          <h1 className="text-[22px] font-bold leading-tight" style={{ color: 'var(--text)', letterSpacing: '-0.015em' }}>
            {product.name[lang]}
          </h1>

          {minPrice !== null && minPrice !== Infinity && (
            <p className="text-[19px] font-bold mt-1.5" style={{ color: 'var(--gold)' }}>
              {tr.product.from} {formatPrice(minPrice)}
            </p>
          )}

          <p className="mt-3 text-[13.5px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
            {product.description[lang]}
          </p>

          {product.sizes.length > 0 && (
            <section className="mt-5">
              <div className="flex items-baseline justify-between mb-2.5">
                <h2 className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>
                  {tr.product.sizes}
                </h2>
                <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>
                  {tr.product.standardSizes}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {product.sizes.map((size, i) => {
                  const active = i === sizeIndex
                  return (
                    <button
                      key={i}
                      onClick={() => setSizeIndex(i)}
                      className="press flex items-center justify-between px-4"
                      style={{
                        height: 48,
                        borderRadius: 'var(--r-sm)',
                        background: active ? 'var(--gold-dim)' : 'var(--surface)',
                        border: `1px solid ${active ? 'var(--gold-line)' : 'var(--border)'}`,
                      }}
                    >
                      <span
                        className="text-[13.5px] font-medium"
                        style={{ color: active ? 'var(--text)' : 'var(--text-2)' }}
                      >
                        {size.label[lang]}
                      </span>
                      <span
                        className="text-[13.5px] font-semibold"
                        style={{ color: active ? 'var(--gold-soft)' : 'var(--text-2)' }}
                      >
                        {formatPrice(size.priceFrom)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div
        className="fixed bottom-0 left-1/2 z-40 w-full px-4 pt-3"
        style={{
          maxWidth: 'var(--shell-max)',
          transform: 'translateX(-50%)',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="flex gap-2.5">
          {canCalculate && (
            <button
              onClick={() => setCalcOpen(true)}
              className="press flex-1 flex items-center justify-center text-[14px] font-semibold"
              style={{
                height: 50,
                borderRadius: 'var(--r-full)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text)',
              }}
            >
              {tr.product.calculator}
            </button>
          )}
          <button
            onClick={() => setOrderOpen(true)}
            className="press flex-1 flex items-center justify-center text-[14px] font-semibold"
            style={{ height: 50, borderRadius: 'var(--r-full)', background: 'var(--gold)', color: '#1a1205' }}
          >
            {tr.product.orderButton}
          </button>
        </div>
      </div>

      <PriceCalculator
        product={product}
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        onOrder={() => {
          setCalcOpen(false)
          setOrderOpen(true)
        }}
      />

      <OrderSheet
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        product={product}
        initialSizeIndex={sizeIndex}
      />
    </>
  )
}

const floatingButton = {
  width: 38,
  height: 38,
  borderRadius: 'var(--r-full)',
  background: 'rgba(0,0,0,0.42)',
  border: '1px solid rgba(255,255,255,0.14)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const
