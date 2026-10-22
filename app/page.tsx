import { TopBar } from '@/components/layout/top-bar'
import { HeroBanner } from '@/components/home/hero-banner'
import { CategoryStrip } from '@/components/home/category-strip'
import { ProductRow } from '@/components/home/product-row'
import { products } from '@/data/products'

const popularProducts = products.filter((p) => p.homeSection === 'popular')
const ideaProducts = products.filter((p) => p.homeSection === 'ideas')

export default function HomePage() {
  return (
    <div className="page-enter min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <TopBar />
      <HeroBanner />

      <section className="mt-5">
        <CategoryStrip />
      </section>

      <ProductRow
        title="Популярное"
        products={popularProducts}
        viewAllHref="/catalog"
      />

      <ProductRow
        title="Идеи для дома"
        products={ideaProducts}
        viewAllHref="/catalog"
      />

      <div className="h-6" />
    </div>
  )
}
