'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { X } from 'lucide-react'
import { CATEGORY_ICONS, IconHammer } from '@/components/ui/icons'

/* ── Lightbox (fullscreen, swipe + thumbnails) ── */
function Lightbox({
  images, name, index, onChange, onClose,
}: {
  images: string[]
  name: string
  index: number
  onChange: (i: number) => void
  onClose: () => void
}) {
  const touchStartX = useRef<number | null>(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function switchTo(i: number) {
    setFading(true)
    setTimeout(() => {
      onChange(i)
      setFading(false)
    }, 140)
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      switchTo(dx < 0
        ? (index + 1) % images.length
        : (index - 1 + images.length) % images.length)
    }
    touchStartX.current = null
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{ background: 'rgba(0,0,0,0.96)' }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>
          {index + 1} / {images.length}
        </span>
        <button
          className="press w-9 h-9 flex items-center justify-center"
          style={{ borderRadius: 'var(--r-full)', background: 'rgba(255,255,255,0.1)' }}
          onClick={onClose}
        >
          <X size={18} color="white" />
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center overflow-hidden px-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[index]}
          alt={`${name} ${index + 1}`}
          className="object-contain select-none"
          style={{
            maxHeight: '100%',
            maxWidth: '100%',
            borderRadius: 16,
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.14s ease',
          }}
          draggable={false}
        />
      </div>

      {images.length > 1 && (
        <div className="flex-shrink-0 flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              className="flex-shrink-0 overflow-hidden transition-all"
              style={{
                width: 60,
                height: 60,
                borderRadius: 12,
                border: i === index ? '2px solid var(--gold)' : '2px solid transparent',
                opacity: i === index ? 1 : 0.45,
              }}
            >
              <img src={src} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface ProductGalleryProps {
  images: string[]
  name: string
  categoryId: string
}

export function ProductGallery({ images, name, categoryId }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const frameStyle = {
    height: 'clamp(300px, 46vh, 430px)',
  } as const

  if (images.length === 0) {
    const Icon = CATEGORY_ICONS[categoryId] ?? IconHammer
    return (
      <div
        className="w-full flex items-center justify-center"
        style={{ ...frameStyle, background: 'linear-gradient(160deg, #1b1b1e 0%, #121214 100%)' }}
      >
        <Icon size={72} color="rgba(255,255,255,0.11)" strokeWidth={1.1} />
      </div>
    )
  }

  return (
    <>
      <div className="relative" style={frameStyle}>
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((src, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] h-full overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={src}
                  alt={`${name} ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade into the page */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: 120, background: 'linear-gradient(180deg, rgba(11,11,12,0) 0%, var(--bg) 100%)' }}
        />

        {images.length > 1 && (
          <div
            className="absolute text-[11px] font-medium"
            style={{
              right: 14,
              bottom: 26,
              padding: '5px 10px',
              borderRadius: 'var(--r-full)',
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {selectedIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          name={name}
          index={lightboxIndex}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
