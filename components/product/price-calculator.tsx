'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus, Check, DoorOpen, Cpu, Paintbrush, Sparkles } from 'lucide-react'
import type { CalculatorOption, OptionIcon, Product } from '@/types'
import { useLang } from '@/contexts/lang-context'
import { TopBar } from '@/components/layout/top-bar'
import { Segmented } from '@/components/ui/segmented'
import { optionsForCategory } from '@/data/calculator-options'
import { SIZE_MAX_CM, SIZE_MIN_CM, estimatePrice, supportsCalculator } from '@/lib/pricing'
import { formatPrice } from '@/lib/utils'

const OPTION_ICONS: Record<OptionIcon, React.ElementType> = {
  wicket: DoorOpen,
  automation: Cpu,
  coating: Paintbrush,
  decor: Sparkles,
}

const MIN_M = SIZE_MIN_CM / 100
const MAX_M = SIZE_MAX_CM / 100
const STEP_M = 0.1

interface PriceCalculatorProps {
  product: Product
  open: boolean
  onClose: () => void
  onOrder: () => void
}

export function PriceCalculator({ product, open, onClose, onOrder }: PriceCalculatorProps) {
  const { tr, lang } = useLang()
  const options = optionsForCategory(product.categoryId)
  const hasSizes = product.sizes.length > 0

  const [mode, setMode] = useState<'standard' | 'custom'>(hasSizes ? 'standard' : 'custom')
  const [sizeIndex, setSizeIndex] = useState(0)
  const [customW, setCustomW] = useState(() => (hasSizes ? product.sizes[0].width / 100 : 2))
  const [customH, setCustomH] = useState(() => (hasSizes ? product.sizes[0].height / 100 : 2))
  const [chosen, setChosen] = useState<Set<string>>(
    () => new Set(options.filter((o) => o.defaultOn).map((o) => o.id)),
  )

  // Standard mode mirrors the catalog size; custom mode keeps its own values.
  const standardSize = hasSizes ? product.sizes[sizeIndex] : undefined
  const useStandard = mode === 'standard' && standardSize !== undefined
  const widthM = useStandard ? standardSize.width / 100 : customW
  const heightM = useStandard ? standardSize.height / 100 : customH

  const optionsTotal = useMemo(
    () => options.filter((o) => chosen.has(o.id)).reduce((sum, o) => sum + o.price, 0),
    [options, chosen],
  )

  const base = useMemo(() => {
    if (useStandard) return { kind: 'price' as const, amount: standardSize.priceFrom }
    return estimatePrice(product, Math.round(widthM * 100), Math.round(heightM * 100))
  }, [useStandard, standardSize, product, widthM, heightM])

  if (!open) return null

  const total = base.kind === 'price' ? base.amount + optionsTotal : null

  function stepStandard(delta: number) {
    setSizeIndex((i) => Math.min(product.sizes.length - 1, Math.max(0, i + delta)))
  }

  function clamp(v: number) {
    return Math.min(MAX_M, Math.max(MIN_M, Math.round(v * 10) / 10))
  }

  return (
    <div
      className="fixed inset-0 z-[120] overflow-y-auto overlay-enter"
      style={{ background: 'var(--bg)', maxWidth: 'var(--shell-max)', margin: '0 auto' }}
    >
      <TopBar variant="modal" title={tr.product.calculatorTitle} onBack={onClose} />

      <div className="px-4 pb-6">
        {/* Mode switch */}
        <Segmented
          options={[
            { id: 'standard', label: tr.order.standard, disabled: !hasSizes },
            { id: 'custom', label: tr.order.custom },
          ]}
          value={mode}
          onChange={(v) => setMode(v as 'standard' | 'custom')}
        />

        {/* Dimensions */}
        <section className="mt-4 p-4" style={cardStyle}>
          <p className="text-[15px] font-bold mb-3.5" style={{ color: 'var(--text)' }}>
            {tr.product.sizes}
          </p>
          <div className="flex gap-3">
            <Stepper
              label={tr.product.widthM}
              value={widthM}
              onDec={() => (useStandard ? stepStandard(-1) : setCustomW((v) => clamp(v - STEP_M)))}
              onInc={() => (useStandard ? stepStandard(1) : setCustomW((v) => clamp(v + STEP_M)))}
              decDisabled={useStandard && sizeIndex === 0}
              incDisabled={useStandard && sizeIndex === product.sizes.length - 1}
            />
            <Stepper
              label={tr.product.heightM}
              value={heightM}
              onDec={() => (useStandard ? stepStandard(-1) : setCustomH((v) => clamp(v - STEP_M)))}
              onInc={() => (useStandard ? stepStandard(1) : setCustomH((v) => clamp(v + STEP_M)))}
              decDisabled={useStandard && sizeIndex === 0}
              incDisabled={useStandard && sizeIndex === product.sizes.length - 1}
            />
          </div>
        </section>

        {/* Options */}
        {options.length > 0 && (
          <section className="mt-4">
            <p className="text-[15px] font-bold mb-2.5" style={{ color: 'var(--text)' }}>
              {tr.product.extraOptions}
            </p>
            <div style={{ ...cardStyle, overflow: 'hidden' }}>
              {options.map((option, i) => (
                <OptionRow
                  key={option.id}
                  option={option}
                  lang={lang}
                  checked={chosen.has(option.id)}
                  last={i === options.length - 1}
                  onToggle={() =>
                    setChosen((prev) => {
                      const next = new Set(prev)
                      if (next.has(option.id)) next.delete(option.id)
                      else next.add(option.id)
                      return next
                    })
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* Estimate */}
        <section className="mt-4 px-5 py-5 text-center" style={cardStyle}>
          <p className="text-[12px]" style={{ color: 'var(--text-2)' }}>
            {tr.product.estimatedPrice}
          </p>
          {total !== null ? (
            <p className="text-[29px] font-bold mt-1.5" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
              {formatPrice(total)}
            </p>
          ) : (
            <p className="text-[22px] font-bold mt-1.5" style={{ color: 'var(--gold)' }}>
              {tr.common.priceOnRequest}
            </p>
          )}
          <p className="text-[11px] leading-relaxed mt-2" style={{ color: 'var(--text-3)' }}>
            {total !== null ? tr.product.estimateDisclaimer : tr.product.calculatorOutOfRange}
          </p>
        </section>

        <button
          onClick={onOrder}
          className="press w-full mt-4 flex items-center justify-center text-[15px] font-semibold"
          style={{ height: 52, borderRadius: 'var(--r-full)', background: 'var(--gold)', color: '#1a1205' }}
        >
          {tr.product.orderButton}
        </button>

        {!supportsCalculator(product) && (
          <p className="text-[11px] text-center mt-3" style={{ color: 'var(--text-3)' }}>
            {tr.product.calculatorQuoteOnly}
          </p>
        )}
      </div>
    </div>
  )
}

const cardStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--r-md)',
} as const

function Stepper({
  label,
  value,
  onDec,
  onInc,
  decDisabled,
  incDisabled,
}: {
  label: string
  value: number
  onDec: () => void
  onInc: () => void
  decDisabled?: boolean
  incDisabled?: boolean
}) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[12px] mb-1.5" style={{ color: 'var(--text-2)' }}>
        {label}
      </p>
      <div
        className="flex items-center justify-between"
        style={{
          height: 46,
          borderRadius: 'var(--r-sm)',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          paddingInline: 6,
        }}
      >
        <StepButton onClick={onDec} disabled={decDisabled}>
          <Minus size={15} />
        </StepButton>
        <span className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>
          {value.toFixed(1)}
        </span>
        <StepButton onClick={onInc} disabled={incDisabled}>
          <Plus size={15} />
        </StepButton>
      </div>
    </div>
  )
}

function StepButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="press flex items-center justify-center flex-shrink-0 disabled:opacity-30"
      style={{
        width: 32,
        height: 32,
        borderRadius: 'var(--r-xs)',
        background: 'var(--surface-3)',
        color: 'var(--text)',
      }}
    >
      {children}
    </button>
  )
}

function OptionRow({
  option,
  lang,
  checked,
  last,
  onToggle,
}: {
  option: CalculatorOption
  lang: 'ru' | 'kz'
  checked: boolean
  last: boolean
  onToggle: () => void
}) {
  const Icon = OPTION_ICONS[option.icon]

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-3.5"
      style={{
        height: 56,
        borderBottom: last ? 'none' : '1px solid var(--border)',
      }}
    >
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 32, height: 32, borderRadius: 'var(--r-xs)', background: 'var(--surface-2)' }}
      >
        <Icon size={16} color="var(--text-2)" strokeWidth={1.7} />
      </span>

      <span className="flex-1 min-w-0 text-left text-[13.5px] font-medium truncate" style={{ color: 'var(--text)' }}>
        {option.name[lang]}
      </span>

      <span className="text-[12.5px] flex-shrink-0" style={{ color: 'var(--text-2)' }}>
        + {formatPrice(option.price)}
      </span>

      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          background: checked ? 'var(--gold)' : 'transparent',
          border: `1.5px solid ${checked ? 'var(--gold)' : 'var(--border-strong)'}`,
        }}
      >
        {checked && <Check size={13} color="#1a1205" strokeWidth={3} />}
      </span>
    </button>
  )
}
