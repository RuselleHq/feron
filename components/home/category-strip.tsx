'use client'

import Link from 'next/link'
import { categories } from '@/data/categories'
import { useLang } from '@/contexts/lang-context'
import { CATEGORY_ICONS } from '@/components/ui/icons'

interface CategoryStripProps {
  activeId?: string
}

export function CategoryStrip({ activeId }: CategoryStripProps) {
  const { lang } = useLang()

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 py-3" style={{ width: 'max-content' }}>
        {categories.map((cat) => {
          const isActive = cat.id === activeId
          const Icon = CATEGORY_ICONS[cat.id]
          return (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl transition-all active:scale-95 min-w-[64px]"
              style={{
                background: isActive ? 'var(--color-steel)' : 'var(--color-surface)',
                border: `1px solid ${isActive ? 'var(--color-steel)' : 'var(--color-border)'}`,
                boxShadow: isActive ? 'none' : 'var(--shadow-sm)',
              }}
            >
              {Icon && (
                <Icon
                  size={22}
                  color={isActive ? 'white' : 'var(--color-text-secondary)'}
                  strokeWidth={1.5}
                />
              )}
              <span
                className="text-[11px] font-medium text-center leading-tight whitespace-nowrap"
                style={{ color: isActive ? 'white' : 'var(--color-text-secondary)' }}
              >
                {cat.name[lang]}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
