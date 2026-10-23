'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { useLang } from '@/contexts/lang-context'
import { OrderSheet } from '@/components/order/order-sheet'
import { BrandMark } from '@/components/layout/brand-mark'
import { IconGates } from '@/components/ui/icons'

const HERO_IMAGE = '/images/products/gate-01-1.png'

export function HeroBanner() {
  const { tr } = useLang()
  const [orderOpen, setOrderOpen] = useState(false)
  const [imageOk, setImageOk] = useState(true)

  return (
    <>
      <section className="relative flex-1 flex flex-col" style={{ minHeight: 420 }}>
        {/* Backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          {imageOk ? (
            <img
              src={HERO_IMAGE}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
              onError={() => setImageOk(false)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
              <IconGates size={96} color="rgba(255,255,255,0.07)" strokeWidth={1} />
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(11,11,12,0.78) 0%, rgba(11,11,12,0.32) 26%, rgba(11,11,12,0.86) 62%, var(--bg) 100%)',
            }}
          />
        </div>

        {/* Header row */}
        <div
          className="relative z-10 flex items-start justify-between px-4"
          style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}
        >
          <BrandMark size={30} />

          <div
            className="flex items-center gap-1.5 text-[11px] font-medium"
            style={{
              height: 30,
              paddingInline: 11,
              borderRadius: 'var(--r-full)',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <MapPin size={12} color="var(--gold)" />
            {tr.home.hero.location}
          </div>
        </div>

        <div className="flex-1" style={{ minHeight: 90 }} />

        {/* Copy + actions */}
        <div className="relative z-10 px-4 pb-6">
          <h2
            className="font-bold"
            style={{ fontSize: 'clamp(28px, 8vw, 34px)', lineHeight: 1.12, color: 'var(--text)', letterSpacing: '-0.015em' }}
          >
            {tr.home.hero.titleLine1}
            <br />
            {tr.home.hero.titleLine2}
            <br />
            <span style={{ color: 'var(--gold)' }}>{tr.home.hero.titleAccent}</span>{' '}
            {tr.home.hero.titleRest}
          </h2>

          <p className="mt-3 text-[13px] leading-relaxed" style={{ color: 'var(--text-2)', maxWidth: 300 }}>
            {tr.home.hero.subtitle}
          </p>

          <div className="mt-5 flex items-center gap-2.5">
            <Link
              href="/catalog"
              className="press flex items-center justify-center text-[14px] font-semibold"
              style={{
                height: 48,
                paddingInline: 22,
                borderRadius: 'var(--r-full)',
                background: 'var(--gold)',
                color: '#1a1205',
              }}
            >
              {tr.home.hero.cta}
            </Link>
            <button
              onClick={() => setOrderOpen(true)}
              className="press flex items-center justify-center text-[14px] font-semibold"
              style={{
                height: 48,
                paddingInline: 20,
                borderRadius: 'var(--r-full)',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {tr.home.hero.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  )
}
