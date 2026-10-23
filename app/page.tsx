import { HeroBanner } from '@/components/home/hero-banner'
import { CategoryStrip } from '@/components/home/category-strip'

export default function HomePage() {
  return (
    <div
      className="page-enter flex flex-col"
      style={{
        background: 'var(--bg)',
        minHeight: 'calc(100dvh - var(--nav-height) - env(safe-area-inset-bottom, 0px) - 16px)',
      }}
    >
      <HeroBanner />

      <section className="pb-2">
        <CategoryStrip variant="home" />
      </section>
    </div>
  )
}
