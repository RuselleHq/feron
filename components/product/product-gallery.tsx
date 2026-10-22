'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { IconHammer } from '@/components/ui/icons'
import { X } from 'lucide-react'

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
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: 'rgba(0,0,0,0.94)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {index + 1} / {images.length}
        </span>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)' }}
          onClick={onClose}
        >
          <X size={18} color="white" />
        </button>
      </div>

      {/* Main image with swipe */}
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

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex-shrink-0 flex gap-2 px-4 py-3 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => switchTo(i)}
              className="flex-shrink-0 rounded-xl overflow-hidden transition-all"
              style={{
                width: 64,
                height: 64,
                border: i === index
                  ? '2px solid var(--color-gold)'
                  : '2px solid transparent',
                opacity: i === index ? 1 : 0.5,
              }}
            >
              <img
                src={src}
                alt={`${name} ${i + 1}`}
                className="w-full h-full object-cover"
              />
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
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
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

  if (images.length === 0) {
    return (
      <div
        className="w-full aspect-[4/3] flex items-center justify-center"
        style={{ background: 'var(--color-bg-muted)' }}
      >
        <IconHammer size={56} color="var(--color-border)" strokeWidth={1.2} />
      </div>
    )
  }

  return (
    <>
      {/* ── Gallery strip (4:3) ── */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((src, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] aspect-[4/3] overflow-hidden cursor-zoom-in"
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

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === selectedIndex ? 20 : 6,
                  height: 6,
                  background: i === selectedIndex ? 'white' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        )}

      </div>

      {/* ── Lightbox ── */}
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
