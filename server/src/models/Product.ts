import mongoose, { Schema, Document } from 'mongoose'

export interface IProductVariant {
  _id: mongoose.Types.ObjectId
  sku: string
  size?: string
  color?: string
  price: number
  originalPrice: number
  stockQuantity: number
  images?: string[]
}

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice: number
  images: string[]
  thumbnail: string
  category: mongoose.Types.ObjectId
  brand: mongoose.Types.ObjectId
  variants: IProductVariant[]
  tags: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  stockQuantity: number
  sku: string
  hsn?: string
  gstRate: number
  attributes: Map<string, string>
  isFeatured: boolean
  isNewArrival: boolean
  isTrending: boolean
  isActive: boolean
  seo: { title?: string; description?: string; keywords?: string[] }
  cloudinaryIds: string[]
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const variantSchema = new Schema<IProductVariant>({
  sku: { type: String, required: true },
  size: String,
  color: String,
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  images: [String],
})

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    images: [String],
    thumbnail: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    variants: [variantSchema],
    tags: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true },
    hsn: String,
    gstRate: { type: Number, enum: [0, 5, 12, 18, 28], default: 18 },
    attributes: { type: Map, of: String, default: {} },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    cloudinaryIds: [String],
    deletedAt: Date,
  },
  { timestamps: true },
)

productSchema.index({ category: 1 })
productSchema.index({ brand: 1 })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ isTrending: 1 })
productSchema.index({ isFeatured: 1 })
productSchema.index({ isNewArrival: 1 })
productSchema.index({ isActive: 1 })
productSchema.index({ tags: 1 })
productSchema.index({ name: 'text', description: 'text', tags: 'text' })

export default mongoose.model<IProduct>('Product', productSchema)
