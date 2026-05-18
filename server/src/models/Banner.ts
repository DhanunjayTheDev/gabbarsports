import mongoose, { Schema, Document } from 'mongoose'

export interface IBanner extends Document {
  title: string
  subtitle?: string
  image: string
  mobileImage?: string
  ctaText?: string
  ctaLink?: string
  isActive: boolean
  position: number
  startDate?: Date
  endDate?: Date
  cloudinaryId?: string
}

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: String,
    image: { type: String, required: true },
    mobileImage: String,
    ctaText: String,
    ctaLink: String,
    isActive: { type: Boolean, default: true },
    position: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    cloudinaryId: String,
  },
  { timestamps: true },
)

bannerSchema.index({ isActive: 1, position: 1 })

export default mongoose.model<IBanner>('Banner', bannerSchema)
