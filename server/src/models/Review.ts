import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
  order?: mongoose.Types.ObjectId
  rating: number
  title: string
  body: string
  images: string[]
  isVerifiedPurchase: boolean
  isApproved: boolean
  helpful: number
  createdAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 100 },
    body: { type: String, required: true, maxlength: 1000 },
    images: [String],
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true },
)

reviewSchema.index({ product: 1, createdAt: -1 })
reviewSchema.index({ user: 1 })
reviewSchema.index({ user: 1, product: 1 }, { unique: true })

export default mongoose.model<IReview>('Review', reviewSchema)
