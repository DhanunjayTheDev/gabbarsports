import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  parent?: mongoose.Types.ObjectId
  isActive: boolean
  sortOrder: number
  seo: { title?: string; description?: string; keywords?: string[] }
  deletedAt?: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
    icon: String,
    parent: { type: Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    deletedAt: Date,
  },
  { timestamps: true },
)

categorySchema.index({ slug: 1 })
categorySchema.index({ parent: 1 })
categorySchema.index({ isActive: 1 })

export default mongoose.model<ICategory>('Category', categorySchema)
