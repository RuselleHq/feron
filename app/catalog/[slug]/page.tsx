'use client'

import { notFound } from 'next/navigation'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Share2, ArrowLeft } from 'lucide-react'
import { ProductGallery } from '@/components/product/product-gallery'
import { PriceCalculator } from '@/components/product/price-calculator'
import { OrderSheet } from '@/components/order/order-sheet'
import { products } from '@/data/products'
import { useLang } from '@/contexts/lang-context'
import { useFavorites } from '@/contexts/favorites-context'
import { formatPrice } from '@/lib/utils'
import dynamic from 'next/dynamic'

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
  const [sizesOpen, setSizesOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)

  const minPrice = product.sizes.length > 0
    ? product.sizes.reduce((min, s) => Math.min(min, s.priceFrom), Infinity)
    : null

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product!.name[lang], url: window.location.href })
    }
  }

  return (
    <>
      <div className="min-h-screen page-enter" style={{ background: 'var(--color-bg)' }}>

        {/* Gallery + floating controls */}
        <div className="relative">
          <ProductGallery images={product.images} name={product.name[lang]} />

          {/* Floating top bar over image */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 pt-3 pointer-events-none z-10">
            <Link
              href="/catalog"
              className="pointer-events-auto w-9 h-9 flex items-center justify-center rounded-full active:opacity-60"
              style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
            >
              <ArrowLeft size={18} color="white" />
            </Link>
            <div className="flex gap-2 pointer-events-auto">
              <button
                onClick={handleShare}
                className="w-9 h-9 flex items-center justify-center rounded-full active:opacity-60"
                style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
              >
                <Share2 size={15} color="white" />
              </button>
              <button
                onClick={() => toggle(product.id)}
                className="w-9 h-9 flex items-center justify-center rounded-full active:opacity-60"
                style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
              >
                <Heart
                  size={15}
                  strokeWidth={2}
                  color={isFav ? '#e74c3c' : 'white'}
                  fill={isFav ? '#e74c3c' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 3D viewer */}
        {product.model3d && (
          <div className="px-4 mt-4">
            <Product3dViewer modelPath={product.model3d} />
          </div>
        )}

        {/* Info */}
        <div className="px-4 pt-4 pb-20">
          <h1 className="text-[20px] font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
            {product.name[lang]}
          </h1>

          {minPrice !== null && minPrice !== Infinity && (
            <p className="text-[18px] font-semibold mt-1" style={{ color: 'var(--color-gold)' }}>
              {tr.product.from} {formatPrice(minPrice)}
            </p>
          )}

          <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {product.description[lang]}
          </p>

          {/* Sizes accordion */}
          {product.sizes.length > 0 && (
            <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
              <button
                className="w-full flex items-center justify-between px-4 py-3 active:opacity-70"
                style={{ background: 'var(--color-surface)' }}
                onClick={() => setSizesOpen(v => !v)}
              >
                <span className="text-[14px] font-semibold" style={{ color: 'var(--color-text)' }}>
                  {tr.product.sizes}
                </span>
                <span className="text-[18px] leading-none transition-transform" style={{
                  color: 'var(--color-text-muted)',
                  transform: sizesOpen ? 'rotate(180deg)' : 'none',
                  display: 'inline-block',
                }}>
                  ›
                </span>
              </button>
              {sizesOpen && product.sizes.map((size, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    borderTop: '1px solid var(--color-border-subtle)',
                    background: i % 2 === 0 ? 'var(--color-bg-subtle)' : 'var(--color-surface)',
                  }}
                >
                  <span className="text-[13px]" style={{ color: 'var(--color-text)' }}>
                    {size.label[lang]}
                  </span>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--color-gold)' }}>
                    {formatPrice(size.priceFrom)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Calculator accordion */}
          <PriceCalculator
            pricePerSqM={product.pricePerSqM}
            open={calcOpen}
            onToggle={() => setCalcOpen(v => !v)}
          />
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 py-2"
        style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <button
          onClick={() => setOrderOpen(true)}
          className="w-full flex items-center justify-center h-11 rounded-xl text-[15px] font-semibold text-white transition-opacity active:opacity-80"
          style={{ background: 'var(--color-steel)' }}
        >
          {tr.product.orderButton}
        </button>
      </div>

      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} product={product} />
    </>
  )
}
