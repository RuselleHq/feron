interface BrandMarkProps {
  size?: number
}

export function BrandMark({ size = 30 }: BrandMarkProps) {
  return (
    <div className="flex flex-col" style={{ lineHeight: 1 }}>
      <span
        className="font-display"
        style={{
          fontSize: size,
          fontWeight: 400,
          letterSpacing: '0.2em',
          color: 'var(--text)',
          textIndent: '0.2em',
        }}
      >
        FERON
      </span>
      <span
        style={{
          fontSize: Math.max(7, Math.round(size * 0.26)),
          letterSpacing: '0.56em',
          color: 'rgba(255,255,255,0.55)',
          marginTop: Math.round(size * 0.18),
          textIndent: '0.56em',
          fontWeight: 500,
        }}
      >
        CRAFT
      </span>
    </div>
  )
}
