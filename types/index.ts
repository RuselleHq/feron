export type Lang = 'ru' | 'kz'

export interface Category {
  id: string
  slug: string
  name: { ru: string; kz: string }
}

export interface ProductSize {
  label: { ru: string; kz: string }
  width: number
  height: number
  priceFrom: number
}

export type PriceMethod = 'area' | 'length' | 'quote'

export type OptionIcon = 'wicket' | 'automation' | 'coating' | 'decor'

export interface CalculatorOption {
  id: string
  name: { ru: string; kz: string }
  price: number
  icon: OptionIcon
  /** Selected by default, matching the reference screen */
  defaultOn?: boolean
}

export interface Product {
  id: string
  slug: string
  name: { ru: string; kz: string }
  description: { ru: string; kz: string }
  categoryId: string
  images: string[]
  model3d?: string
  sizes: ProductSize[]
  priceMethod: PriceMethod
  featured?: boolean
  homeSection?: 'popular' | 'ideas'
  tags?: string[]
}

