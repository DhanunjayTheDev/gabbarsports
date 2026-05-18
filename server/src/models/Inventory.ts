import mongoose, { Schema, Document } from 'mongoose'

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId
  variant?: mongoose.Types.ObjectId
  stockQuantity: number
  reservedQuantity: number
  soldQuantity: number
  lowStockThreshold: number
  history: Array<{
    action: 'restock' | 'sale' | 'return' | 'adjustment'
    quantity: number
    note?: string
    performedBy?: mongoose.Types.ObjectId
    timestamp: Date
  }>
}

const inventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: Schema.Types.ObjectId },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    reservedQuantity: { type: Number, default: 0 },
    soldQuantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    history: [{
      action: { type: String, enum: ['restock', 'sale', 'return', 'adjustment'], required: true },
      quantity: { type: Number, required: true },
      note: String,
      performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true },
)

inventorySchema.index({ product: 1 })
inventorySchema.index({ stockQuantity: 1 })

export default mongoose.model<IInventory>('Inventory', inventorySchema)
