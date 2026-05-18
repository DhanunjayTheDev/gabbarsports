import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Review from '../models/Review'
import Product from '../models/Product'
import Order from '../models/Order'
import { sendSuccess, AppError } from '../utils/response'
import { getPagination, buildMeta } from '../utils/pagination'

export async function getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)

    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.productId, isApproved: true })
        .populate('user', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ product: req.params.productId, isApproved: true }),
    ])

    const ratingAgg = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(req.params.productId as string), isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])

    sendSuccess(res, {
      data: reviews,
      meta: {
        ...buildMeta(total, page, limit),
        averageRating: ratingAgg[0]?.avg || 0,
        totalReviews: ratingAgg[0]?.count || 0,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, rating, title, body, images, orderId } = req.body
    const userId = req.user!._id

    const product = await Product.findById(productId)
    if (!product) throw new AppError('Product not found', 404)

    let isVerifiedPurchase = false
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        user: userId,
        'items.product': productId,
        status: 'delivered',
      })
      isVerifiedPurchase = !!order
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      title,
      body,
      images: images || [],
      isVerifiedPurchase,
    })

    // Update product rating
    const stats = await Review.aggregate([
      { $match: { product: product._id, isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])

    if (stats[0]) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      })
    }

    sendSuccess(res, { message: 'Review submitted', data: review, statusCode: 201 })
  } catch (err) {
    next(err)
  }
}

export async function markHelpful(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    )
    if (!review) throw new AppError('Review not found', 404)
    sendSuccess(res, { data: review })
  } catch (err) {
    next(err)
  }
}

export async function deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user!._id })
    if (!review) throw new AppError('Review not found', 404)
    sendSuccess(res, { message: 'Review deleted' })
  } catch (err) {
    next(err)
  }
}
