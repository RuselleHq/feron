'use client'

import type { ReactNode } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { useLang } from '@/contexts/lang-context'
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react'
import { IconForge } from '@/components/ui/icons'

export default function ProfilePage() {
  const { tr } = useLang()

  const phone = process.env.NEXT_PUBLIC_PHONE ?? '+77771234567'
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '77771234567'

  return (
    <div className="min-h-screen page-enter" style={{ background: 'var(--color-bg)' }}>
      <TopBar title={tr.profile.title} />

      <div className="px-4 pt-4 pb-10 flex flex-col gap-4">
        {/* About */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-steel)' }}
            >
              <IconForge size={26} color="white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[15px] font-bold" style={{ color: 'var(--color-text)' }}>
                Feron Craft
              </p>
              <p className="text-[12px]" style={{ color: 'var(--color-gold)' }}>
                Семей, Казахстан
              </p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {tr.profile.about}
          </p>
        </div>

        {/* Contacts */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <p
            className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider"
            style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)' }}
          >
            {tr.profile.contacts}
          </p>

          <ContactRow
            icon={<Phone size={16} />}
            label={tr.profile.phone}
            value={phone}
            href={`tel:${phone}`}
          />
          <ContactRow
            icon={<MessageCircle size={16} />}
            label={tr.profile.telegram}
            value="@metalwork_semey"
            href={`https://t.me/metalwork_semey`}
          />
          <ContactRow
            icon={<MessageCircle size={16} />}
            label={tr.profile.whatsapp}
            value={phone}
            href={`https://wa.me/${wa}`}
          />
          <ContactRow
            icon={<MapPin size={16} />}
            label={tr.profile.location}
            value={tr.profile.locationValue}
          />
          <ContactRow
            icon={<Clock size={16} />}
            label={tr.profile.hours}
            value={tr.profile.hoursValue}
            last
          />
        </div>

        {/* How it works */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <p className="text-[14px] font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            {tr.profile.howItWorks}
          </p>
          <div className="flex flex-col gap-4">
            {tr.profile.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 mt-0.5"
                  style={{ background: 'var(--color-steel)', color: 'white' }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>
                    {step.title}
                  </p>
                  <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
  last = false,
}: {
  icon: ReactNode
  label: string
  value: string
  href?: string
  last?: boolean
}) {
  const inner = (
    <div
      className="flex items-center gap-3 px-4 py-3.5"
      style={{ borderBottom: last ? 'none' : '1px solid var(--color-border-subtle)' }}
    >
      <span style={{ color: 'var(--color-text-muted)' }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </p>
        <p className="text-[14px] font-medium truncate" style={{ color: 'var(--color-text)' }}>
          {value}
        </p>
      </div>
      {href && (
        <span className="text-[12px] font-medium" style={{ color: 'var(--color-gold)' }}>
          →
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {inner}
      </a>
    )
  }

  return inner
}
