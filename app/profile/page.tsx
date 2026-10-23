'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  ChevronRight, Package, Heart, Store, HelpCircle, MessageSquare, ShieldCheck, ArrowRight,
} from 'lucide-react'
import { useLang } from '@/contexts/lang-context'
import { useFavorites } from '@/contexts/favorites-context'
import { IconForge } from '@/components/ui/icons'
import { OrderSheet } from '@/components/order/order-sheet'
import { AboutWorkshop } from '@/components/profile/about-workshop'

export default function ProfilePage() {
  const { tr, lang, setLang } = useLang()
  const { count } = useFavorites()
  const [aboutOpen, setAboutOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)

  return (
    <div className="page-enter min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Identity */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ paddingTop: 'calc(18px + env(safe-area-inset-top, 0px))', paddingBottom: 18 }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 52, height: 52, borderRadius: 'var(--r-full)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <IconForge size={25} color="var(--gold)" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[17px] font-bold" style={{ color: 'var(--text)' }}>
            Feron Craft
          </p>
          <p className="text-[12.5px]" style={{ color: 'var(--text-2)' }}>
            {tr.profile.city}
          </p>
        </div>
        <button
          onClick={() => setLang(lang === 'ru' ? 'kz' : 'ru')}
          className="press flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
          style={{
            height: 30,
            paddingInline: 11,
            borderRadius: 'var(--r-full)',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-2)',
          }}
        >
          {lang === 'ru' ? 'KZ' : 'RU'}
        </button>
      </div>

      {/* Menu */}
      <div
        className="mx-4 overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}
      >
        <MenuRow icon={<Package size={17} />} label={tr.profile.menu.orders} />
        <MenuRow icon={<Heart size={17} />} label={tr.profile.menu.favorites} href="/favorites" badge={count || undefined} />
        <MenuRow icon={<Store size={17} />} label={tr.profile.menu.about} onClick={() => setAboutOpen(true)} />
        <MenuRow icon={<HelpCircle size={17} />} label={tr.profile.menu.faq} />
        <MenuRow icon={<MessageSquare size={17} />} label={tr.profile.menu.contact} onClick={() => setOrderOpen(true)} />
        <MenuRow icon={<ShieldCheck size={17} />} label={tr.profile.menu.privacy} last />
      </div>

      {/* Promo */}
      <div
        className="mx-4 mt-4 relative overflow-hidden p-5"
        style={{
          borderRadius: 'var(--r-md)',
          background: 'linear-gradient(135deg, #2a2016 0%, #16130f 58%, #121214 100%)',
          border: '1px solid var(--border)',
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            right: -42,
            top: -42,
            width: 170,
            height: 170,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,151,74,0.22) 0%, rgba(201,151,74,0) 68%)',
          }}
        />
        <p className="relative text-[17px] font-bold leading-snug" style={{ color: 'var(--text)', maxWidth: 220 }}>
          {tr.profile.promo.title}
        </p>
        <p className="relative text-[12.5px] leading-relaxed mt-1.5" style={{ color: 'var(--text-2)', maxWidth: 230 }}>
          {tr.profile.promo.desc}
        </p>
        <button
          onClick={() => setOrderOpen(true)}
          className="press relative mt-4 flex items-center gap-2 px-5 text-[13.5px] font-semibold"
          style={{ height: 44, borderRadius: 'var(--r-full)', background: '#ffffff', color: '#17171a' }}
        >
          {tr.profile.promo.cta}
          <ArrowRight size={15} />
        </button>
      </div>

      <AboutWorkshop open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <OrderSheet open={orderOpen} onClose={() => setOrderOpen(false)} />
    </div>
  )
}

function MenuRow({
  icon,
  label,
  href,
  onClick,
  badge,
  last = false,
}: {
  icon: ReactNode
  label: string
  href?: string
  onClick?: () => void
  badge?: number
  last?: boolean
}) {
  const interactive = Boolean(href || onClick)

  const inner = (
    <div
      className="flex items-center gap-3 px-4"
      style={{ height: 54, borderBottom: last ? 'none' : '1px solid var(--border)' }}
    >
      <span style={{ color: 'var(--text-2)' }} className="flex-shrink-0">
        {icon}
      </span>
      <span className="flex-1 text-[14px] font-medium truncate" style={{ color: 'var(--text)' }}>
        {label}
      </span>
      {badge !== undefined && (
        <span
          className="flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ minWidth: 22, height: 22, paddingInline: 6, borderRadius: 'var(--r-full)', background: 'var(--gold)', color: '#1a1205' }}
        >
          {badge}
        </span>
      )}
      <ChevronRight size={16} color="var(--text-3)" className="flex-shrink-0" />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block active:opacity-70">
        {inner}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left active:opacity-70">
        {inner}
      </button>
    )
  }

  return <div aria-disabled>{interactive ? inner : inner}</div>
}
