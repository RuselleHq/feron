'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLang } from '@/contexts/lang-context'
import { OrderSheet } from '@/components/order/order-sheet'
import { IconGates } from '@/components/ui/icons'

export function HeroBanner() {
  const { tr } = useLang()
  const [orderOpen, setOrderOpen] = useState(false)

  return (
    <>
      <section
        className="relative mx-4 mt-3 overflow-hidden"
        style={{ borderRadius: 18, minHeight: 220 }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, var(--color-steel) 0%, #1a1f30 100%)',
          }}
        />

        {/* Decorative SVG */}
        <div
          className="absolute right-2 top-2 opacity-[0.08] select-none pointer-events-none"
          style={{ transform: 'rotate(-10deg)' }}
        >
          <IconGates size={110} color="white" strokeWidth={1} />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col gap-4">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-gold)' }}>
              Семей, Казахстан
            </p>
            <h1
              className="text-[26px] font-bold leading-tight text-white"
              style={{ whiteSpace: 'pre-line' }}
            >
              {tr.home.hero.title}
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {tr.home.hero.subtitle}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/catalog"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-opacity active:opacity-70"
              style={{ background: 'var(--color-gold)' }}
            >
              {tr.home.hero.cta}
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setOrderOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-opacity active:opacity-70"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}
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
