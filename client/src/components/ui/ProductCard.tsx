import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { cn, formatPrice, calculateDiscount } from '@/lib/utils'
import type { Product } from '@/types'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()

  const inWishlist = isInWishlist(product._id)
  const discount = calculateDiscount(product.originalPrice, product.price)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.thumbnail,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      stock: product.stockQuantity,
    })
    toast.success('Added to cart')
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.thumbnail,
      price: product.price,
      originalPrice: product.originalPrice,
      brand: product.brand.name,
      inStock: product.inStock,
    })
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <motion.div
      className={cn('group relative', className)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-card-hover hover:border-gray-200 transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {!imgLoaded && <div className="absolute inset-0 shimmer-bg" />}
            <img
              src={product.thumbnail}
              alt={product.name}
              className={cn(
                'w-full h-full object-cover transition-all duration-500 group-hover:scale-105',
                imgLoaded ? 'opacity-100' : 'opacity-0',
              )}
              onLoad={() => setImgLoaded(true)}
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNewArrival && (
                <span className="px-2 py-0.5 bg-brand-blue text-white text-[10px] font-bold font-accent rounded-md">
                  NEW
                </span>
              )}
              {product.isTrending && (
                <span className="px-2 py-0.5 bg-brand-orange text-white text-[10px] font-bold font-accent rounded-md flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> HOT
                </span>
              )}
              {discount >= 10 && (
                <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold font-accent rounded-md">
                  -{discount}%
                </span>
              )}
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                <span className="text-gray-500 font-heading text-sm tracking-widest border border-gray-300 px-3 py-1 rounded-full">
                  OUT OF STOCK
                </span>
              </div>
            )}

            {/* Wishlist button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute right-3 top-3"
            >
              <button
                onClick={handleWishlist}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm',
                  inWishlist
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50',
                )}
                aria-label="Wishlist"
              >
                <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
              </button>
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-gray-400 text-xs font-accent uppercase tracking-wider mb-1">
              {product.brand.name}
            </p>
            <h3 className="text-gray-800 font-accent font-medium text-sm line-clamp-2 leading-snug mb-2 group-hover:text-brand-orange transition-colors duration-200">
              {product.name}
            </h3>

            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-gray-600 text-xs font-accent">{product.rating.toFixed(1)}</span>
                <span className="text-gray-400 text-xs font-accent">({product.reviewCount})</span>
              </div>
            )}

            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-900 font-bold text-lg font-accent">{formatPrice(product.price)}</span>
                  {discount > 0 && (
                    <span className="text-gray-400 text-sm font-accent line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-accent font-semibold transition-all duration-200',
                  product.inStock
                    ? 'bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white border border-brand-orange/20 hover:border-transparent'
                    : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100',
                )}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
