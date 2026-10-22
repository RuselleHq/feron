'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3x3, Heart, User, Plus } from 'lucide-react'
import { useLang } from '@/contexts/lang-context'
import { useFavorites } from '@/contexts/favorites-context'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { OrderSheet } from '@/components/order/order-sheet'

const navItems = [
  { href: '/', icon: Home, labelKey: 'home' as const },
  { href: '/catalog', icon: Grid3x3, labelKey: 'catalog' as const },
  { href: '/favorites', icon: Heart, labelKey: 'favorites' as const },
  { href: '/profile', icon: User, labelKey: 'profile' as const },
]

export function BottomNav() {
  const pathname = usePathname()
  const { tr } = useLang()
  const { count } = useFavorites()
  const [orderOpen, setOrderOpen] = useState(false)

  // Hide on product detail pages — order button takes its place
  const isProductPage = /^\/catalog\/.+/.test(pathname)
  if (isProductPage) return null

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))', paddingLeft: 12, paddingRight: 12 }}
      >
        <div
          className="flex items-center h-16 px-2"
          style={{
            background: 'var(--color-surface)',
            borderRadius: 20,
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          }}
        >
          {/* Home */}
          <NavItem href="/" icon={Home} label={tr.nav.home} active={pathname === '/'} />

          {/* Catalog */}
          <NavItem href="/catalog" icon={Grid3x3} label={tr.nav.catalog} active={pathname.startsWith('/catalog')} />

          {/* Center CTA */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setOrderOpen(true)}
              className="flex flex-col items-center justify-center w-14 h-14 rounded-full transition-transform active:scale-95"
              style={{ background: 'var(--color-steel)' }}
              aria-label={tr.nav.order}
            >
              <Plus size={22} color="white" strokeWidth={2.5} />
            </button>
          </div>

          {/* Favorites */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/favorites"
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors"
            >
              <div className="relative">
                <Heart
                  size={22}
                  strokeWidth={1.8}
                  style={{
                    color: pathname === '/favorites' ? 'var(--color-steel)' : 'var(--color-text-muted)',
                    fill: pathname === '/favorites' ? 'var(--color-steel)' : 'none',
                  }}
                />
                {count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-semibold flex items-center justify-center text-white"
                    style={{ background: 'var(--color-gold)' }}
                  >
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: pathname === '/favorites' ? 'var(--color-steel)' : 'var(--color-text-muted)' }}
              >
                {tr.nav.favorites}
              </span>
            </Link>
          </div>

          {/* Profile */}
          <NavItem href="/profile" icon={User} label={tr.nav.profile} active={pathname === '/profile'} />
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
}: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
}) {
  return (
    <div className="flex-1 flex justify-center">
      <Link
        href={href}
        className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors"
      >
        <Icon
          size={22}
          strokeWidth={1.8}
          style={{
            color: active ? 'var(--color-steel)' : 'var(--color-text-muted)',
          }}
        />
        <span
          className="text-[10px] font-medium"
          style={{ color: active ? 'var(--color-steel)' : 'var(--color-text-muted)' }}
        >
          {label}
        </span>
      </Link>
    </div>
  )
}
