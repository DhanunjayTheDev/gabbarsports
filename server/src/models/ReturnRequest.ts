import mongoose, { Schema, Document } from 'mongoose'

export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'picked_up' | 'refunded'

export interface IReturnRequest extends Document {
  order: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  items: Array<{
    orderItem: mongoose.Types.ObjectId
    quantity: number
    reason: string
  }>
  status: ReturnStatus
  refundMethod: 'original' | 'wallet' | 'bank'
  refundAmount: number
  adminNotes?: string
  images: string[]
  timeline: Array<{ status: ReturnStatus; message: string; timestamp: Date }>
  createdAt: Date
}

const returnRequestSchema = new Schema<IReturnRequest>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
      orderItem: { type: Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true, min: 1 },
      reason: { type: String, required: true },
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'picked_up', 'refunded'],
      default: 'pending',
    },
    refundMethod: {
      type: String,
      enum: ['original', 'wallet', 'bank'],
      default: 'original',
    },
    refundAmount: { type: Number, required: true },
    adminNotes: String,
    images: [String],
    timeline: [{
      status: String,
      message: String,
      timestamp: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true },
)

returnRequestSchema.index({ order: 1 })
returnRequestSchema.index({ user: 1 })
returnRequestSchema.index({ status: 1 })

export default mongoose.model<IReturnRequest>('ReturnRequest', returnRequestSchema)
