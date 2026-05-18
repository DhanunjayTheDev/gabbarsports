import mongoose, { Schema, Document } from 'mongoose'

interface ICartItem {
  product: mongoose.Types.ObjectId
  variant?: mongoose.Types.ObjectId
  quantity: number
  price: number
  name: string
  image: string
  sku?: string
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId
  items: ICartItem[]
  couponCode?: string
  couponDiscount: number
  updatedAt: Date
}

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      variant: { type: Schema.Types.ObjectId },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      sku: String,
    }],
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

cartSchema.index({ user: 1 })

export default mongoose.model<ICart>('Cart', cartSchema)
