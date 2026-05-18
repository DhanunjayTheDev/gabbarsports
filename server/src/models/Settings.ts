import mongoose, { Schema, Document } from 'mongoose'

export interface ISettings extends Document {
  key: string
  value: unknown
  group: 'shipping' | 'payment' | 'tax' | 'seo' | 'general'
  description?: string
}

const settingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    group: {
      type: String,
      enum: ['shipping', 'payment', 'tax', 'seo', 'general'],
      required: true,
    },
    description: String,
  },
  { timestamps: true },
)

settingsSchema.index({ key: 1 })
settingsSchema.index({ group: 1 })

export default mongoose.model<ISettings>('Settings', settingsSchema)
