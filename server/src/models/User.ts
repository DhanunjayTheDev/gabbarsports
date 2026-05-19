import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  phone?: string
  password?: string
  googleId?: string
  avatar?: string
  role: 'customer' | 'super_admin' | 'manager' | 'inventory' | 'support'
  isVerified: boolean
  isActive: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  refreshTokens: string[]
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, minlength: 6, select: false },
    googleId: { type: String, sparse: true },
    avatar: String,
    role: {
      type: String,
      enum: ['customer', 'super_admin', 'manager', 'inventory', 'support'],
      default: 'customer',
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    refreshTokens: { type: [String], select: false, default: [] },
    lastLogin: Date,
  },
  { timestamps: true },
)

userSchema.index({ role: 1 })
userSchema.index({ createdAt: -1 })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}

export default mongoose.model<IUser>('User', userSchema)
