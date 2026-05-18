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
  isNewArrival: boolean
  isTrending: boolean
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
  images?: string[]
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  parent?: string
  isActive: boolean
}

export interface Brand {
  _id: string
  name: string
  slug: string
  logo?: string
  description?: string
}

export interface Order {
  _id: string
  orderNumber: string
  user: string
  items: OrderItem[]
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  razorpayOrderId?: string
  subtotal: number
  discount: number
  shippingCharge: number
  gstAmount: number
  total: number
  shippingAddress: Address
  couponCode?: string
  timeline: OrderTimeline[]
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
  name: string
  image: string
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderTimeline {
  status: OrderStatus
  message: string
  timestamp: string
}

export interface Address {
  _id?: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault?: boolean
  type?: 'home' | 'work' | 'other'
}

export interface Review {
  _id: string
  user: { name: string; avatar?: string }
  product: string
  rating: number
  title: string
  body: string
  images?: string[]
  isVerifiedPurchase: boolean
  createdAt: string
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

export interface SEO {
  title?: string
  description?: string
  keywords?: string[]
}

export interface Banner {
  _id: string
  title: string
  subtitle?: string
  image: string
  mobileImage?: string
  ctaText?: string
  ctaLink?: string
  isActive: boolean
  position: number
}

export interface FilterOptions {
  category?: string
  brand?: string[]
  priceMin?: number
  priceMax?: number
  rating?: number
  inStock?: boolean
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popularity'
  page?: number
  limit?: number
  search?: string
}
