export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginationMeta
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice: number
  images: string[]
  thumbnail: string
  category: Category
  brand: Brand
  variants: ProductVariant[]
  tags: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  stockQuantity: number
  sku: string
  hsn?: string
  gstRate: number
  attributes: Record<string, string>
  isFeatured: boolean
  isNew: boolean
  isTrending: boolean
  isActive: boolean
  seo: SEO
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  _id: string
  sku: string
  size?: string
  color?: string
  price: number
  originalPrice: number
  stockQuantity: number
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
}

export interface Brand {
  _id: string
  name: string
  slug: string
  logo?: string
}

export interface Order {
  _id: string
  orderNumber: string
  user: string | { _id: string; name: string; email: string }
  items: OrderItem[]
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  subtotal: number
  discount: number
  shippingCharge: number
  gstAmount: number
  total: number
  shippingAddress: Address
  couponCode?: string
  timeline: OrderTimeline[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  product: string | Product
  quantity: number
  price: number
  name: string
  image: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'return_requested' | 'returned' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderTimeline {
  status: OrderStatus
  message: string
  timestamp: string
}

export interface Address {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface Coupon {
  _id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount: number
  maxDiscount?: number
  expiresAt: string
  usageLimit: number
  usedCount: number
}

export interface Banner {
  _id: string
  title: string
  image: string
  ctaText?: string
  ctaLink?: string
  isActive: boolean
  position: number
}

export interface SEO {
  title?: string
  description?: string
  keywords?: string[]
}

export interface FilterOptions {
  sort?: string
  page?: number
  limit?: number
}
