import { Request, Response, NextFunction } from 'express'
import Coupon from '../models/Coupon'
import { sendSuccess, AppError } from '../utils/response'
import { getPagination, buildMeta } from '../utils/pagination'

export async function validateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, orderAmount } = req.body

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
      $expr: { $lt: ['$usedCount', '$usageLimit'] },
    })

    if (!coupon) throw new AppError('Invalid or expired coupon', 400)
    if (orderAmount < coupon.minOrderAmount) {
      throw new AppError(`Minimum order amount is ₹${coupon.minOrderAmount}`, 400)
    }

    const alreadyUsed = coupon.usedBy.some(
      (id) => id.toString() === req.user!._id.toString()
    )
    if (alreadyUsed) throw new AppError('Coupon already used', 400)

    let discountAmount = 0
    if (coupon.type === 'percentage') {
      discountAmount = Math.min(
        (orderAmount * coupon.value) / 100,
        coupon.maxDiscount || Infinity,
      )
    } else {
      discountAmount = coupon.value
    }

    sendSuccess(res, {
      message: 'Coupon applied',
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount: Math.round(discountAmount * 100) / 100,
        maxDiscount: coupon.maxDiscount,
      },
    })
  } catch (err) {
    next(err)
  }
}

// Admin endpoints
export async function getCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)
    const [coupons, total] = await Promise.all([
      Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Coupon.countDocuments(),
    ])
    sendSuccess(res, { data: coupons, meta: buildMeta(total, page, limit) })
  } catch (err) {
    next(err)
  }
}

export async function createCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupon = await Coupon.create(req.body)
    sendSuccess(res, { message: 'Coupon created', data: coupon, statusCode: 201 })
  } catch (err) {
    next(err)
  }
}

export async function updateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!coupon) throw new AppError('Coupon not found', 404)
    sendSuccess(res, { message: 'Coupon updated', data: coupon })
  } catch (err) {
    next(err)
  }
}

export async function deleteCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!coupon) throw new AppError('Coupon not found', 404)
    sendSuccess(res, { message: 'Coupon deleted' })
  } catch (err) {
    next(err)
  }
}
