'use client'

interface SegmentedProps {
  options: { id: string; label: string; disabled?: boolean }[]
  value: string
  onChange: (id: string) => void
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div
      className="flex gap-1 p-1"
      style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-full)', border: '1px solid var(--border)' }}
    >
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            disabled={o.disabled}
            onClick={() => onChange(o.id)}
            className="flex-1 text-[13px] font-semibold transition-colors disabled:opacity-40"
            style={{
              height: 38,
              borderRadius: 'var(--r-full)',
              background: active ? 'var(--gold)' : 'transparent',
              color: active ? '#1a1205' : 'var(--text-2)',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
