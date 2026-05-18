import mongoose, { Schema, Document } from 'mongoose'

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'return_requested' | 'returned' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface IOrderItem {
  _id?: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  variant?: mongoose.Types.ObjectId
  name: string
  image: string
  sku: string
  quantity: number
  price: number
  gstRate: number
  hsn?: string
}

export interface IOrderAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface IOrder extends Document {
  orderNumber: string
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  subtotal: number
  discount: number
  shippingCharge: number
  gstAmount: number
  total: number
  shippingAddress: IOrderAddress
  couponCode?: string
  couponDiscount: number
  trackingNumber?: string
  estimatedDelivery?: Date
  timeline: Array<{ status: OrderStatus; message: string; timestamp: Date }>
  notes?: string
  refundAmount?: number
  refundReason?: string
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  image: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  gstRate: { type: Number, default: 18 },
  hsn: String,
})

const addressSchema = new Schema<IOrderAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
})

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'returned', 'refunded'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: { type: String, required: true },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shippingAddress: { type: addressSchema, required: true },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    trackingNumber: String,
    estimatedDelivery: Date,
    timeline: [{
      status: String,
      message: String,
      timestamp: { type: Date, default: Date.now },
    }],
    notes: String,
    refundAmount: Number,
    refundReason: String,
  },
  { timestamps: true },
)

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ paymentStatus: 1 })
orderSchema.index({ 'shippingAddress.pincode': 1 })

async function generateOrderNumber(): Promise<string> {
  const count = await mongoose.model('Order').countDocuments()
  return `GS-${String(count + 1001).padStart(6, '0')}`
}

orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = await generateOrderNumber()
    this.timeline.push({
      status: this.status,
      message: 'Order placed successfully',
      timestamp: new Date(),
    })
  }
  next()
})

export default mongoose.model<IOrder>('Order', orderSchema)
