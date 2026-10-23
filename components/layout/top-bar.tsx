'use client'

import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface TopBarProps {
  /** Large left-aligned screen title (Каталог, Избранное) */
  title?: string
  /** Centered title with a back control (Калькулятор, О мастерской) */
  variant?: 'large' | 'modal'
  onBack?: () => void
  action?: ReactNode
}

export function TopBar({ title, variant = 'large', onBack, action }: TopBarProps) {
  if (variant === 'modal') {
    return (
      <header
        className="sticky top-0 z-30 flex items-center px-4"
        style={{
          height: 56,
          background: 'var(--bg)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <button
          onClick={onBack}
          aria-label="Назад"
          className="press flex items-center justify-center"
          style={{ width: 36, height: 36, marginLeft: -8 }}
        >
          <ChevronLeft size={24} color="var(--text)" strokeWidth={2} />
        </button>
        <span className="flex-1 text-center text-[16px] font-semibold" style={{ color: 'var(--text)' }}>
          {title}
        </span>
        <div style={{ width: 36 }}>{action}</div>
      </header>
    )
  }

  return (
    <header
      className="flex items-center justify-between px-4"
      style={{ paddingTop: 'calc(14px + env(safe-area-inset-top, 0px))', paddingBottom: 14 }}
    >
      <h1 className="text-[26px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>
        {title}
      </h1>
      {action}
    </header>
  )
}

export function RoundButton({
  children,
  onClick,
  href,
  label,
  size = 40,
  background = 'var(--surface-2)',
}: {
  children: ReactNode
  onClick?: () => void
  href?: string
  label?: string
  size?: number
  background?: string
}) {
  const style = {
    width: size,
    height: size,
    borderRadius: 'var(--r-full)',
    background,
    border: '1px solid var(--border)',
  } as const

  if (href) {
    return (
      <a href={href} aria-label={label} className="press flex items-center justify-center" style={style}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} aria-label={label} className="press flex items-center justify-center" style={style}>
      {children}
    </button>
  )
}
