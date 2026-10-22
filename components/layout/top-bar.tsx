'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useLang } from '@/contexts/lang-context'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title?: string
  showBack?: boolean
  backHref?: string
  action?: React.ReactNode
  className?: string
}

export function TopBar({ title, showBack, backHref = '/', action, className }: TopBarProps) {
  const { lang, setLang } = useLang()

  return (
    <header
      className={cn('sticky top-0 z-40 flex items-center h-[52px] px-4', className)}
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* Left */}
      <div className="w-10">
        {showBack && (
          <Link
            href={backHref}
            className="flex items-center justify-center w-9 h-9 -ml-1 rounded-xl transition-colors active:opacity-60"
          >
            <ChevronLeft size={22} strokeWidth={1.8} style={{ color: 'var(--color-text)' }} />
          </Link>
        )}
      </div>

      {/* Title */}
      <div className="flex-1 text-center">
        <span className="text-[15px] font-semibold" style={{ color: 'var(--color-text)' }}>
          {title ?? 'Feron Craft'}
        </span>
      </div>

      {/* Right: lang toggle or custom action */}
      <div className="w-10 flex justify-end">
        {action ?? (
          <button
            onClick={() => setLang(lang === 'ru' ? 'kz' : 'ru')}
            className="h-7 px-2 rounded-md text-[12px] font-semibold transition-colors active:opacity-60"
            style={{
              background: 'var(--color-bg-muted)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {lang === 'ru' ? 'KZ' : 'RU'}
          </button>
        )}
      </div>
    </header>
  )
}
