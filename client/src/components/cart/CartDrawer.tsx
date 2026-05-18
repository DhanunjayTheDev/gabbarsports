import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUIStore } from '@/stores/uiStore'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUIStore()
  const { items, removeItem, updateQuantity, subtotal, couponDiscount, total } = useCartStore()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white border-l border-gray-100 z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-orange" />
                <h2 className="font-heading text-xl text-gray-900 tracking-wider">YOUR CART</h2>
                {items.length > 0 && (
                  <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-20"
                  >
                    <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                    <p className="font-heading text-2xl text-gray-300 tracking-wider">CART EMPTY</p>
                    <p className="text-gray-400 text-sm font-accent mt-2">Add some sports gear!</p>
                    <Link
                      to="/"
                      onClick={() => setCartOpen(false)}
                      className="mt-6 btn-primary"
                    >
                      Shop Now
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.variantId || ''}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow duration-200"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-50"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-800 text-sm font-accent font-medium line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        {(item.size || item.color) && (
                          <p className="text-gray-400 text-xs font-accent mt-0.5">
                            {[item.size, item.color].filter(Boolean).join(' / ')}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-gray-500 disabled:opacity-30 transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-gray-800 text-sm font-bold w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-gray-500 disabled:opacity-30 transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-900 font-bold font-accent">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-gray-300 hover:text-red-400 transition-colors duration-200"
                              aria-label="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-accent">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-800">{formatPrice(subtotal())}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm font-accent">
                      <span className="text-green-600">Coupon Discount</span>
                      <span className="text-green-600">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-gray-900 font-accent">Total</span>
                    <span className="text-gray-900 text-xl font-heading">{formatPrice(total())}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 btn-primary text-center"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-center text-gray-400 text-sm font-accent hover:text-gray-700 transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
