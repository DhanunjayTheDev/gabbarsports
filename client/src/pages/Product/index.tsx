import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Heart, ShoppingCart, Star, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, Share2, Minus, Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { SkeletonText } from '@/components/ui/SkeletonCard'
import type { ApiResponse, Product, ProductVariant } from '@/types'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)

  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get<ApiResponse<Product>>(`/products/${slug}`).then((r) => r.data),
    enabled: !!slug,
  })

  const product = data?.data

  if (isLoading) return <ProductSkeleton />
  if (!product) return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
      <p className="text-gray-400 font-accent">Product not found</p>
    </div>
  )

  const price = selectedVariant ? selectedVariant.price : product.price
  const originalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice
  const stock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity
  const discount = calculateDiscount(originalPrice, price)
  const inWishlist = isInWishlist(product._id)

  function handleAddToCart() {
    if (stock === 0 || !product) return
    addItem({
      productId: product!._id,
      variantId: selectedVariant?._id,
      name: product!.name,
      slug: product!.slug,
      image: product!.thumbnail,
      price,
      originalPrice,
      quantity,
      size: selectedVariant?.size,
      color: selectedVariant?.color,
      stock,
    })
    toast.success('Added to cart!')
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100"
            >
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount >= 10 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-brand-orange text-white text-sm font-bold font-accent rounded-lg">
                  -{discount}% OFF
                </div>
              )}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((i) => Math.max(0, i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((i) => Math.min(product.images.length - 1, i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white transition-all shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </motion.div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      i === selectedImage ? 'border-brand-orange' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-brand-orange font-accent text-sm font-semibold uppercase tracking-wider">
                {product.brand.name}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl text-gray-900 tracking-wide mt-1 leading-tight">
                {product.name}
              </h1>
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm font-accent">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="font-heading text-4xl text-gray-900">{formatPrice(price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-gray-400 text-xl font-accent line-through">{formatPrice(originalPrice)}</span>
                  <span className="text-green-600 font-accent font-bold text-sm">Save {formatPrice(originalPrice - price)}</span>
                </>
              )}
            </div>

            {/* Variants - Size */}
            {product.variants.length > 0 && (
              <div>
                <p className="text-sm font-accent text-gray-500 mb-3 uppercase tracking-wider">
                  {product.variants[0]?.size ? 'Select Size' : 'Select Variant'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stockQuantity === 0}
                      className={`px-4 py-2 rounded-xl text-sm font-accent font-medium border transition-all duration-200 ${
                        selectedVariant?._id === variant._id
                          ? 'bg-brand-orange border-brand-orange text-white'
                          : variant.stockQuantity === 0
                          ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through bg-gray-50'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
                      }`}
                    >
                      {variant.size || variant.color || variant.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-accent text-gray-500 mb-3 uppercase tracking-wider">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 transition-all border border-transparent hover:border-gray-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-gray-900 font-bold font-accent w-8 text-center text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 disabled:opacity-30 transition-all border border-transparent hover:border-gray-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-gray-400 text-sm font-accent">
                  {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
              >
                <ShoppingCart className="w-5 h-5" />
                {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => {
                  toggleItem({
                    productId: product._id,
                    name: product.name,
                    slug: product.slug,
                    image: product.thumbnail,
                    price,
                    originalPrice,
                    brand: product.brand.name,
                    inStock: stock > 0,
                  })
                  toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
                }}
                className={`w-14 flex items-center justify-center rounded-xl border transition-all duration-200 ${
                  inWishlist
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
              <button className="w-14 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-700 transition-all duration-200">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { icon: Truck, text: 'Free Delivery above ₹999' },
                { icon: Shield, text: '100% Genuine' },
                { icon: RotateCcw, text: '7-Day Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl text-center">
                  <Icon className="w-5 h-5 text-brand-orange" />
                  <span className="text-gray-500 text-xs font-accent leading-snug">{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-heading text-xl text-gray-900 tracking-wider mb-3">ABOUT</h3>
              <p className="text-gray-500 font-accent text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Attributes */}
            {Object.keys(product.attributes || {}).length > 0 && (
              <div>
                <h3 className="font-heading text-xl text-gray-900 tracking-wider mb-3">SPECIFICATIONS</h3>
                <div className="space-y-2">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-400 text-sm font-accent capitalize">{key}</span>
                      <span className="text-gray-800 text-sm font-accent">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          <div className="space-y-6">
            <div className="space-y-3">
              <SkeletonText className="h-4 w-24" />
              <SkeletonText className="h-10 w-4/5" />
              <SkeletonText className="h-4 w-32" />
            </div>
            <SkeletonText className="h-12 w-40" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonText key={i} className="h-10 w-16 rounded-xl" />)}
            </div>
            <div className="flex gap-3">
              <SkeletonText className="h-14 flex-1 rounded-xl" />
              <SkeletonText className="h-14 w-14 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
