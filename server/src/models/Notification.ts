import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  type: 'order_update' | 'refund' | 'promotion' | 'system' | 'low_stock'
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: Date
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['order_update', 'refund', 'promotion', 'system', 'low_stock'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)

notificationSchema.index({ user: 1, isRead: 1 })
notificationSchema.index({ createdAt: -1 })

export default mongoose.model<INotification>('Notification', notificationSchema)
