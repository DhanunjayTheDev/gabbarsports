import { Request, Response, NextFunction } from 'express'
import ReturnRequest from '../models/ReturnRequest'
import Order from '../models/Order'
import { sendSuccess, AppError } from '../utils/response'
import { getPagination, buildMeta } from '../utils/pagination'

export async function createReturnRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId, items, refundMethod } = req.body
    const userId = req.user!._id

    const order = await Order.findOne({ _id: orderId, user: userId })
    if (!order) throw new AppError('Order not found', 404)
    if (!['delivered'].includes(order.status)) {
      throw new AppError('Only delivered orders can be returned', 400)
    }

    const existing = await ReturnRequest.findOne({ order: orderId, user: userId })
    if (existing) throw new AppError('Return request already submitted for this order', 400)

    const refundAmount = items.reduce((sum: number, item: any) => {
      const orderItem = order.items.find((oi) => oi._id?.toString() === item.orderItem)
      if (!orderItem) return sum
      return sum + orderItem.price * item.quantity
    }, 0)

    const returnReq = await ReturnRequest.create({
      order: orderId,
      user: userId,
      items,
      refundMethod: refundMethod || 'original',
      refundAmount,
      timeline: [{ status: 'pending', message: 'Return request submitted', timestamp: new Date() }],
    })

    sendSuccess(res, { message: 'Return request submitted', data: returnReq, statusCode: 201 })
  } catch (err) {
    next(err)
  }
}

export async function getMyReturnRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)

    const [returns, total] = await Promise.all([
      ReturnRequest.find({ user: req.user!._id })
        .populate('order', 'orderNumber total')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReturnRequest.countDocuments({ user: req.user!._id }),
    ])

    sendSuccess(res, { data: returns, meta: buildMeta(total, page, limit) })
  } catch (err) {
    next(err)
  }
}
