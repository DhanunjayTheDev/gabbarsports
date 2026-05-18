import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Plus, Minus, Tag, ArrowRight, X } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'
import { api } from '@/lib/axios'
import { toast } from 'sonner'

export default function CartPage() {
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const {
    items, removeItem, updateQuantity, subtotal, couponDiscount, couponCode, total,
    applyCoupon, removeCoupon, saveForLater, savedItems, moveToCart,
  } = useCartStore()

  const SHIPPING_THRESHOLD = 999
  const shippingCharge = subtotal() >= SHIPPING_THRESHOLD ? 0 : 99

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await api.post('/coupons/validate', {
        code: couponInput.trim(),
        orderAmount: subtotal(),
      })
      applyCoupon(data.data.code, data.data.discountAmount)
      toast.success(`Coupon applied! You save ${formatPrice(data.data.discountAmount)}`)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error?.response?.data?.message || 'Invalid coupon code')
    } finally {
      setCouponLoading(false)
    }
  }

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-200 mx-auto mb-6" />
          <h2 className="font-heading text-4xl text-gray-300 tracking-wider mb-3">CART IS EMPTY</h2>
          <p className="text-gray-400 font-accent mb-8">Add some sports gear to get started</p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-heading text-4xl md:text-5xl text-gray-900 tracking-wider mb-8">
          YOUR <span className="text-brand-orange">CART</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.variantId || ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-5 hover:shadow-sm transition-shadow duration-200"
                >
                  <Link to={`/product/${item.slug}`}>
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0 bg-gray-50" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/product/${item.slug}`} className="text-gray-800 font-accent font-medium hover:text-brand-orange transition-colors line-clamp-2 text-sm">
                          {item.name}
                        </Link>
                        {(item.size || item.color) && (
                          <p className="text-gray-400 text-xs font-accent mt-1">
                            {[item.size, item.color].filter(Boolean).join(' / ')}
                          </p>
                        )}
                      </div>
                      <button onClick={() => removeItem(item.productId, item.variantId)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-gray-500 disabled:opacity-30 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-gray-800 font-bold font-accent w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white text-gray-500 disabled:opacity-30 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => saveForLater(item.productId, item.variantId)}
                          className="text-xs text-gray-400 hover:text-gray-700 font-accent transition-colors"
                        >
                          Save for later
                        </button>
                        <span className="font-bold font-accent text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Saved for later */}
            {savedItems.length > 0 && (
              <div>
                <h3 className="font-heading text-xl text-gray-400 tracking-wider mb-4">SAVED FOR LATER ({savedItems.length})</h3>
                <div className="space-y-3">
                  {savedItems.map((item) => (
                    <div key={`${item.productId}-${item.variantId || ''}`} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50" />
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm font-accent">{item.name}</p>
                        <p className="text-gray-900 font-bold font-accent mt-1">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => moveToCart(item.productId, item.variantId)}
                        className="text-xs text-brand-orange hover:text-brand-orange-dark font-accent transition-colors"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-heading text-xl text-gray-900 tracking-wider">ORDER SUMMARY</h3>

              {/* Coupon */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 font-accent text-sm focus:outline-none focus:border-brand-orange/40 transition-all"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput}
                    className="px-4 py-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/20 rounded-xl text-brand-orange text-sm font-accent font-semibold disabled:opacity-50 transition-all"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
                {couponCode && (
                  <div className="flex items-center justify-between mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
                    <span className="text-green-600 text-sm font-accent font-bold">{couponCode}</span>
                    <button onClick={removeCoupon} className="text-green-500 hover:text-green-700">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100">
                {[
                  { label: 'Subtotal', value: formatPrice(subtotal()) },
                  { label: 'Shipping', value: shippingCharge === 0 ? 'FREE' : formatPrice(shippingCharge) },
                  ...(couponDiscount > 0 ? [{ label: `Coupon (${couponCode})`, value: `-${formatPrice(couponDiscount)}`, green: true }] : []),
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex justify-between text-sm font-accent">
                    <span className="text-gray-500">{label}</span>
                    <span className={green ? 'text-green-600 font-semibold' : 'text-gray-800'}>{value}</span>
                  </div>
                ))}

                {subtotal() < SHIPPING_THRESHOLD && (
                  <p className="text-gray-400 text-xs font-accent">
                    Add {formatPrice(SHIPPING_THRESHOLD - subtotal())} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-heading text-xl text-gray-900">TOTAL</span>
                <span className="font-heading text-2xl text-gray-900">
                  {formatPrice(total() + shippingCharge)}
                </span>
              </div>

              <Link to="/checkout" className="w-full btn-primary flex items-center justify-center gap-2 py-4">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
