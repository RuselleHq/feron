export { default } from '../../../../app/catalog/[slug]/page'

import { products } from '../../../../data/products'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}
