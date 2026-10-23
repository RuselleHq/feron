'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Heart, User, Plus } from 'lucide-react'
import { useState } from 'react'
import { useLang } from '@/contexts/lang-context'
import { OrderSheet } from '@/components/order/order-sheet'

export function BottomNav() {
  const pathname = usePathname()
  const { tr } = useLang()
  const [orderOpen, setOrderOpen] = useState(false)

  // Product detail keeps its own action bar instead of the tab bar
  if (/^\/catalog\/.+/.test(pathname)) return null

  return (
    <>
      <nav
        className="fixed bottom-0 left-1/2 z-50 w-full"
        style={{
          maxWidth: 'var(--shell-max)',
          transform: 'translateX(-50%)',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="relative flex items-end" style={{ height: 'var(--nav-height)' }}>
          <NavItem
            href="/"
            icon={Home}
            label={tr.nav.home}
            active={pathname === '/'}
          />
          <NavItem
            href="/catalog"
            icon={LayoutGrid}
            label={tr.nav.catalog}
            active={pathname.startsWith('/catalog')}
          />

          {/* Center action */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setOrderOpen(true)}
              aria-label={tr.nav.order}
              className="press flex items-center justify-center"
              style={{
                width: 54,
                height: 54,
                borderRadius: 'var(--r-full)',
                background: 'var(--gold)',
                marginBottom: 14,
                boxShadow: '0 8px 20px rgba(201,151,74,0.32)',
              }}
            >
              <Plus size={24} color="#1a1205" strokeWidth={2.6} />
            </button>
          </div>

          <NavItem
            href="/favorites"
            icon={Heart}
            label={tr.nav.favorites}
            active={pathname === '/favorites'}
            fillWhenActive
          />
          <NavItem
            href="/profile"
            icon={User}
            label={tr.nav.profile}
            active={pathname === '/profile'}
            fillWhenActive
          />
        </div>
      </nav>

      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  fillWhenActive = false,
}: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
  fillWhenActive?: boolean
}) {
  const color = active ? 'var(--gold)' : 'var(--text-3)'

  return (
    <div className="flex-1 flex justify-center">
      <Link
        href={href}
        className="flex flex-col items-center gap-[5px] pb-3 pt-2 px-2"
        style={{ color }}
      >
        <Icon
          size={21}
          strokeWidth={active ? 2 : 1.7}
          color={color}
          fill={active && fillWhenActive ? 'var(--gold)' : 'none'}
        />
        <span className="text-[10px] font-medium" style={{ color }}>
          {label}
        </span>
      </Link>
    </div>
  )
}
