import mongoose, { Schema, Document } from 'mongoose'

export interface IActivityLog extends Document {
  user?: mongoose.Types.ObjectId
  action: string
  resource: string
  resourceId?: mongoose.Types.ObjectId
  details?: Record<string, unknown>
  ip?: string
  userAgent?: string
  createdAt: Date
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId },
    details: { type: Schema.Types.Mixed },
    ip: String,
    userAgent: String,
  },
  { timestamps: true },
)

activityLogSchema.index({ user: 1, createdAt: -1 })
activityLogSchema.index({ resource: 1 })
activityLogSchema.index({ createdAt: -1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }) // 90 days TTL

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema)
