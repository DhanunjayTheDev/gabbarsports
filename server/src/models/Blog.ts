import mongoose, { Schema, Document } from 'mongoose'

export interface IBlog extends Document {
  title: string
  slug: string
  content: string
  excerpt: string
  thumbnail?: string
  author: mongoose.Types.ObjectId
  tags: string[]
  isPublished: boolean
  publishedAt?: Date
  seo: { title?: string; description?: string }
  views: number
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    thumbnail: String,
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    seo: { title: String, description: String },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
)

blogSchema.index({ slug: 1 })
blogSchema.index({ isPublished: 1, publishedAt: -1 })

export default mongoose.model<IBlog>('Blog', blogSchema)
