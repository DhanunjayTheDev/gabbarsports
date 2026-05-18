import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addItem = useCartStore((s) => s.addItem)

  function moveToCart(item: typeof items[0]) {
    if (!item.inStock) return
    addItem({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: 1,
      stock: 99,
    })
    removeItem(item.productId)
    toast.success('Moved to cart!')
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-heading text-4xl text-gray-900 tracking-wider">WISHLIST</h1>
          {items.length > 0 && <span className="text-gray-400 font-accent">({items.length} items)</span>}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <p className="font-heading text-3xl text-gray-300 tracking-wider">WISHLIST EMPTY</p>
            <Link to="/" className="btn-primary mt-8 inline-flex">Browse Products</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-sm transition-shadow duration-200"
              >
                <Link to={`/product/${item.slug}`}>
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-gray-50" />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs font-accent uppercase">{item.brand}</p>
                  <Link to={`/product/${item.slug}`} className="text-gray-800 text-sm font-accent font-medium line-clamp-2 hover:text-brand-orange transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-gray-900 font-bold font-accent mt-1">{formatPrice(item.price)}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => moveToCart(item)}
                      disabled={!item.inStock}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white border border-brand-orange/20 hover:border-transparent rounded-lg text-xs font-accent transition-all disabled:opacity-30"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
