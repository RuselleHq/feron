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

export interface Product {
  id: string
  slug: string
  name: { ru: string; kz: string }
  description: { ru: string; kz: string }
  categoryId: string
  images: string[]
  model3d?: string
  sizes: ProductSize[]
  pricePerSqM: number
  featured?: boolean
  homeSection?: 'popular' | 'ideas'
  tags?: string[]
}

export interface OrderRequest {
  id: string
  productId?: string
  productName?: string
  customerName: string
  phone: string
  sizeType: 'standard' | 'custom'
  selectedSize?: ProductSize
  customWidth?: number
  customHeight?: number
  comment?: string
  fileUrl?: string
  fileName?: string
  createdAt: string
}
