import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import Address from '../models/Address'
import { sendSuccess, AppError } from '../utils/response'
import { getPagination, buildMeta } from '../utils/pagination'

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user!._id).select('-password -refreshTokens -resetPasswordToken -resetPasswordExpires')
    sendSuccess(res, { data: user })
  } catch (err) {
    next(err)
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const allowedFields = ['firstName', 'lastName', 'phone', 'avatar']
    const updates: Record<string, any> = {}
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }

    const user = await User.findByIdAndUpdate(req.user!._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -refreshTokens -resetPasswordToken -resetPasswordExpires')

    sendSuccess(res, { message: 'Profile updated', data: user })
  } catch (err) {
    next(err)
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user!._id)
    if (!user) throw new AppError('User not found', 404)

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) throw new AppError('Current password incorrect', 400)

    user.password = newPassword
    await user.save()

    sendSuccess(res, { message: 'Password changed successfully' })
  } catch (err) {
    next(err)
  }
}

// Addresses
export async function getAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const addresses = await Address.find({ user: req.user!._id }).lean()
    sendSuccess(res, { data: addresses })
  } catch (err) {
    next(err)
  }
}

export async function addAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const addressCount = await Address.countDocuments({ user: req.user!._id })
    if (addressCount >= 5) throw new AppError('Maximum 5 addresses allowed', 400)

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user!._id }, { isDefault: false })
    }

    const address = await Address.create({ ...req.body, user: req.user!._id })
    sendSuccess(res, { message: 'Address added', data: address, statusCode: 201 })
  } catch (err) {
    next(err)
  }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user!._id }, { isDefault: false })
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!address) throw new AppError('Address not found', 404)
    sendSuccess(res, { message: 'Address updated', data: address })
  } catch (err) {
    next(err)
  }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user!._id })
    if (!address) throw new AppError('Address not found', 404)
    sendSuccess(res, { message: 'Address deleted' })
  } catch (err) {
    next(err)
  }
}

// Admin: list customers
export async function getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)
    const search = req.query.search as string

    const filter: Record<string, any> = { role: 'customer' }
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -refreshTokens -resetPasswordToken -resetPasswordExpires')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ])

    sendSuccess(res, { data: users, meta: buildMeta(total, page, limit) })
  } catch (err) {
    next(err)
  }
}

export async function getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'customer' })
      .select('-password -refreshTokens -resetPasswordToken -resetPasswordExpires')
    if (!user) throw new AppError('Customer not found', 404)
    sendSuccess(res, { data: user })
  } catch (err) {
    next(err)
  }
}

export async function toggleCustomerStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'customer' })
    if (!user) throw new AppError('Customer not found', 404)
    user.isActive = !user.isActive
    await user.save()
    sendSuccess(res, { message: `Customer ${user.isActive ? 'activated' : 'deactivated'}`, data: user })
  } catch (err) {
    next(err)
  }
}
