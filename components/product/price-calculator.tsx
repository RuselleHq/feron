'use client'

import { useState } from 'react'
import { useLang } from '@/contexts/lang-context'
import { calcPrice, formatPrice } from '@/lib/utils'

interface PriceCalculatorProps {
  pricePerSqM: number
  open: boolean
  onToggle: () => void
}

export function PriceCalculator({ pricePerSqM, open, onToggle }: PriceCalculatorProps) {
  const { tr } = useLang()
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  if (!pricePerSqM) return null

  const price = width && height ? calcPrice(pricePerSqM, Number(width), Number(height)) : null

  return (
    <div className="mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(200,150,62,0.3)' }}>
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 active:opacity-70"
        style={{ background: 'var(--color-gold-subtle)' }}
        onClick={onToggle}
      >
        <span className="text-[14px] font-semibold" style={{ color: 'var(--color-text)' }}>
          {tr.product.calculator}
        </span>
        <span className="text-[18px] leading-none" style={{
          color: 'var(--color-gold)',
          transform: open ? 'rotate(180deg)' : 'none',
          display: 'inline-block',
          transition: 'transform 0.2s',
        }}>
          ›
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="px-4 py-3" style={{ background: 'var(--color-gold-subtle)', borderTop: '1px solid rgba(200,150,62,0.2)' }}>
          <p className="text-[12px] mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            {tr.product.calculatorDesc}
          </p>
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-[12px] mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                {tr.product.width}
              </label>
              <input
                type="number"
                min={1}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="200"
                className="w-full px-3 py-2 rounded-xl text-[14px] outline-none"
                style={{
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)' }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[12px] mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                {tr.product.height}
              </label>
              <input
                type="number"
                min={1}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="200"
                className="w-full px-3 py-2 rounded-xl text-[14px] outline-none"
                style={{
                  background: 'white',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-gold)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)' }}
              />
            </div>
          </div>

          {price !== null && (
            <div
              className="px-4 py-3 rounded-xl flex items-center justify-between"
              style={{ background: 'white' }}
            >
              <span className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
                {tr.product.estimatedPrice}
              </span>
              <span className="text-[17px] font-bold" style={{ color: 'var(--color-gold)' }}>
                {formatPrice(price)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
