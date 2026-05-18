import mongoose, { Schema, Document } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount: number
  maxDiscount?: number
  applicableCategories: mongoose.Types.ObjectId[]
  applicableProducts: mongoose.Types.ObjectId[]
  expiresAt: Date
  usageLimit: number
  usedCount: number
  isActive: boolean
  usedBy: mongoose.Types.ObjectId[]
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: Number,
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    expiresAt: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    usedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
)

couponSchema.index({ code: 1 })
couponSchema.index({ isActive: 1, expiresAt: 1 })

export default mongoose.model<ICoupon>('Coupon', couponSchema)
