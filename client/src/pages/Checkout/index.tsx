import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, MapPin, CreditCard, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
})

type AddressForm = z.infer<typeof addressSchema>

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
}

interface RazorpayInstance {
  open: () => void
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

const STEPS = ['Address', 'Review', 'Payment']

const inputClass = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 font-accent text-sm focus:outline-none focus:border-brand-orange/50 transition-all'
const labelClass = 'block text-xs font-accent text-gray-500 mb-1.5 uppercase tracking-wider'

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { items, subtotal, couponCode, couponDiscount, total, clearCart } = useCartStore()
  const navigate = useNavigate()

  const shippingCharge = subtotal() >= 999 ? 0 : 99

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  })

  async function onAddressSubmit() {
    setStep(1)
  }

  async function createOrder() {
    setIsLoading(true)
    try {
      const address = getValues()
      const { data } = await api.post('/orders', {
        items: items.map((item) => ({
          product: item.productId,
          variant: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: { ...address, country: 'India' },
        couponCode,
        paymentMethod: 'razorpay',
      })

      const order = data.data
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.total * 100,
        currency: 'INR',
        name: 'Gabbar Sports',
        description: `Order #${order.orderNumber}`,
        order_id: order.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          await api.post(`/orders/${order._id}/verify-payment`, response)
          clearCart()
          toast.success('Order placed successfully!')
          navigate(`/dashboard/orders`)
        },
        prefill: { name: address.fullName, email: '', contact: address.phone },
        theme: { color: '#FF6B00' },
      })
      rzp.open()
    } catch {
      toast.error('Failed to create order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-heading text-4xl text-gray-900 tracking-wider mb-8">CHECKOUT</h1>

        {/* Steps */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-orange' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  i < step ? 'bg-brand-orange border-brand-orange text-white' :
                  i === step ? 'border-brand-orange text-brand-orange' :
                  'border-gray-200 text-gray-300'
                }`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className="font-accent text-sm font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-brand-orange' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-heading text-2xl text-gray-900 tracking-wider mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-orange" /> DELIVERY ADDRESS
                  </h2>
                  <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { field: 'fullName' as const, label: 'Full Name', placeholder: 'Arjun Sharma' },
                        { field: 'phone' as const, label: 'Phone', placeholder: '9876543210' },
                      ].map(({ field, label, placeholder }) => (
                        <div key={field}>
                          <label className={labelClass}>{label}</label>
                          <input
                            {...register(field)}
                            placeholder={placeholder}
                            className={inputClass}
                          />
                          {errors[field] && <p className="text-red-500 text-xs mt-1 font-accent">{errors[field]?.message}</p>}
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className={labelClass}>Address Line 1</label>
                      <input
                        {...register('addressLine1')}
                        placeholder="House no, Street, Area"
                        className={inputClass}
                      />
                      {errors.addressLine1 && <p className="text-red-500 text-xs mt-1 font-accent">{errors.addressLine1.message}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>Address Line 2 (Optional)</label>
                      <input
                        {...register('addressLine2')}
                        placeholder="Landmark, Near..."
                        className={inputClass}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { field: 'city' as const, label: 'City', placeholder: 'Hyderabad' },
                        { field: 'state' as const, label: 'State', placeholder: 'Telangana' },
                        { field: 'pincode' as const, label: 'Pincode', placeholder: '500001' },
                      ].map(({ field, label, placeholder }) => (
                        <div key={field}>
                          <label className={labelClass}>{label}</label>
                          <input
                            {...register(field)}
                            placeholder={placeholder}
                            className={inputClass}
                          />
                          {errors[field] && <p className="text-red-500 text-xs mt-1 font-accent">{errors[field]?.message}</p>}
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="w-full btn-primary py-4 mt-2">
                      Continue to Review
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-heading text-2xl text-gray-900 tracking-wider mb-6">REVIEW ORDER</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50" />
                        <div className="flex-1">
                          <p className="text-gray-800 text-sm font-accent">{item.name}</p>
                          <p className="text-gray-400 text-xs font-accent">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-gray-900 font-bold font-accent">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(0)} className="flex-1 btn-ghost py-3">Back</button>
                    <button onClick={() => setStep(2)} className="flex-1 btn-primary py-3">Proceed to Payment</button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-heading text-2xl text-gray-900 tracking-wider mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-orange" /> PAYMENT
                  </h2>
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl text-center mb-6">
                    <p className="text-gray-400 font-accent text-sm mb-2">Powered by</p>
                    <span className="font-heading text-2xl text-brand-orange tracking-wider">RAZORPAY</span>
                    <p className="text-gray-400 text-xs font-accent mt-2">UPI, Cards, Net Banking & Wallets</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 btn-ghost py-3">Back</button>
                    <button
                      onClick={createOrder}
                      disabled={isLoading}
                      className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ${formatPrice(total() + shippingCharge)}`}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 h-fit space-y-4 shadow-sm">
            <h3 className="font-heading text-xl text-gray-900 tracking-wider">SUMMARY</h3>
            <div className="space-y-2 text-sm font-accent">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-800">{formatPrice(subtotal())}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={shippingCharge === 0 ? 'text-green-600 font-semibold' : 'text-gray-800'}>{shippingCharge === 0 ? 'FREE' : formatPrice(shippingCharge)}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between"><span className="text-green-600">Coupon</span><span className="text-green-600 font-semibold">-{formatPrice(couponDiscount)}</span></div>}
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-100">
              <span className="font-heading text-xl text-gray-900">TOTAL</span>
              <span className="font-heading text-xl text-gray-900">{formatPrice(total() + shippingCharge)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
