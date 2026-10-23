'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react'
import { useLang } from '@/contexts/lang-context'
import { TopBar } from '@/components/layout/top-bar'
import { IconForge } from '@/components/ui/icons'
import { contacts } from '@/lib/contacts'

const COVER_IMAGE = '/images/products/gate-01-2.png'

interface AboutWorkshopProps {
  open: boolean
  onClose: () => void
}

export function AboutWorkshop({ open, onClose }: AboutWorkshopProps) {
  const { tr } = useLang()
  const [coverOk, setCoverOk] = useState(true)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[130] overflow-y-auto overlay-enter"
      style={{ background: 'var(--bg)', maxWidth: 'var(--shell-max)', margin: '0 auto' }}
    >
      <TopBar variant="modal" title={tr.profile.title} onBack={onClose} />

      <div className="px-4 pb-10">
        {/* Cover */}
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: 'var(--r-md)', height: 190, border: '1px solid var(--border)' }}
        >
          {coverOk ? (
            <img
              src={COVER_IMAGE}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
              onError={() => setCoverOk(false)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(150deg, #1b1b1e 0%, #121214 100%)' }}
            >
              <IconForge size={56} color="rgba(255,255,255,0.12)" strokeWidth={1.2} />
            </div>
          )}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(11,11,12,0.1) 0%, rgba(11,11,12,0.72) 100%)' }}
          />
        </div>

        {/* Workshop card */}
        <div
          className="mt-4 p-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 44, height: 44, borderRadius: 'var(--r-xs)', background: 'var(--surface-2)' }}
            >
              <IconForge size={22} color="var(--gold)" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>
                Feron Craft
              </p>
              <p className="text-[12px]" style={{ color: 'var(--text-2)' }}>
                {tr.profile.city}
              </p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
            {tr.profile.about}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {tr.profile.stats.map((stat) => (
            <div
              key={stat.value}
              className="px-2 py-3.5 text-center"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}
            >
              <p className="text-[20px] font-bold" style={{ color: 'var(--text)' }}>
                {stat.value}
              </p>
              <p className="text-[10.5px] leading-tight mt-1" style={{ color: 'var(--text-3)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Contacts */}
        <div
          className="mt-4 overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}
        >
          <p
            className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-3)', borderBottom: '1px solid var(--border)' }}
          >
            {tr.profile.contacts}
          </p>

          {contacts.phone && (
            <ContactRow icon={<Phone size={15} />} label={tr.profile.phone} value={contacts.phone.value} href={contacts.phone.href} />
          )}
          {contacts.telegram && (
            <ContactRow icon={<MessageCircle size={15} />} label={tr.profile.telegram} value={contacts.telegram.value} href={contacts.telegram.href} />
          )}
          {contacts.whatsapp && (
            <ContactRow icon={<MessageCircle size={15} />} label={tr.profile.whatsapp} value={contacts.whatsapp.value} href={contacts.whatsapp.href} />
          )}
          <ContactRow icon={<MapPin size={15} />} label={tr.profile.location} value={tr.profile.locationValue} />
          <ContactRow icon={<Clock size={15} />} label={tr.profile.hours} value={tr.profile.hoursValue} last />
        </div>

        {/* How it works */}
        <div
          className="mt-4 p-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}
        >
          <p className="text-[14px] font-bold mb-4" style={{ color: 'var(--text)' }}>
            {tr.profile.howItWorks}
          </p>
          <div className="flex flex-col gap-4">
            {tr.profile.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="flex items-center justify-center flex-shrink-0 text-[12px] font-bold"
                  style={{ width: 28, height: 28, borderRadius: 'var(--r-full)', background: 'var(--gold-dim)', color: 'var(--gold)' }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                    {step.title}
                  </p>
                  <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'var(--text-2)' }}>
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
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}
    >
      <span style={{ color: 'var(--text-3)' }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10.5px]" style={{ color: 'var(--text-3)' }}>
          {label}
        </p>
        <p className="text-[13.5px] font-medium truncate" style={{ color: 'var(--text)' }}>
          {value}
        </p>
      </div>
      {href && <span className="text-[12px]" style={{ color: 'var(--gold)' }}>→</span>}
    </div>
  )

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block active:opacity-70">
        {inner}
      </a>
    )
  }

  return inner
}
