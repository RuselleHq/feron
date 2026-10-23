'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { categories } from '@/data/categories'
import { useLang } from '@/contexts/lang-context'
import { CATEGORY_ICONS } from '@/components/ui/icons'

interface CategoryStripProps {
  /** 'home' — icon tile with the label underneath; 'filter' — label inside the tile */
  variant?: 'home' | 'filter'
  activeId?: string
  onSelect?: (slug: string) => void
  /** Prepended "Все" chip, filter variant only */
  allLabel?: string
}

export function CategoryStrip({ variant = 'home', activeId, onSelect, allLabel }: CategoryStripProps) {
  const { lang } = useLang()

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2.5 px-4" style={{ width: 'max-content' }}>
        {variant === 'filter' && allLabel && (
          <Tile
            variant={variant}
            label={allLabel}
            active={activeId === 'all'}
            onClick={() => onSelect?.('all')}
          />
        )}

        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id]
          const active = cat.slug === activeId
          const icon = Icon ? (
            <Icon size={variant === 'home' ? 23 : 21} strokeWidth={1.5} color={active ? '#17171a' : 'var(--text-2)'} />
          ) : null

          if (onSelect) {
            return (
              <Tile
                key={cat.id}
                variant={variant}
                icon={icon}
                label={cat.name[lang]}
                active={active}
                onClick={() => onSelect(cat.slug)}
              />
            )
          }

          return (
            <Tile
              key={cat.id}
              variant={variant}
              icon={icon}
              label={cat.name[lang]}
              active={active}
              href={`/catalog?category=${cat.slug}`}
            />
          )
        })}
      </div>
    </div>
  )
}

function Tile({
  variant,
  icon,
  label,
  active,
  href,
  onClick,
}: {
  variant: 'home' | 'filter'
  icon?: ReactNode
  label: string
  active: boolean
  href?: string
  onClick?: () => void
}) {
  if (variant === 'home') {
    const body = (
      <>
        <div
          className="flex items-center justify-center"
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
          }}
        >
          {icon}
        </div>
        <span className="text-[11px] font-medium text-center whitespace-nowrap" style={{ color: 'var(--text-2)' }}>
          {label}
        </span>
      </>
    )

    return href ? (
      <Link href={href} className="press flex flex-col items-center gap-2">
        {body}
      </Link>
    ) : (
      <button onClick={onClick} className="press flex flex-col items-center gap-2">
        {body}
      </button>
    )
  }

  const filterStyle = {
    minWidth: 68,
    height: 68,
    borderRadius: 18,
    background: active ? '#ffffff' : 'var(--surface-2)',
    border: `1px solid ${active ? '#ffffff' : 'var(--border)'}`,
    color: active ? '#17171a' : 'var(--text-2)',
    padding: '0 10px',
  } as const

  const body = (
    <div className="flex flex-col items-center justify-center gap-1.5 h-full">
      {icon}
      <span className="text-[11px] font-medium whitespace-nowrap">{label}</span>
    </div>
  )

  return href ? (
    <Link href={href} className="press flex-shrink-0" style={filterStyle}>
      {body}
    </Link>
  ) : (
    <button onClick={onClick} className="press flex-shrink-0" style={filterStyle}>
      {body}
    </button>
  )
}
