import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import Order from '../models/Order'
import Product from '../models/Product'
import Coupon from '../models/Coupon'
import { sendSuccess, AppError } from '../utils/response'
import { getPagination, buildMeta } from '../utils/pagination'
import { emitToAdmin, emitToUser } from '../config/socket'
import { queueEmail, queueInvoice } from '../utils/queues'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

const SHIPPING_THRESHOLD = 999
const SHIPPING_CHARGE = 99

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { items, shippingAddress, couponCode, paymentMethod } = req.body
    const userId = req.user!._id

    // Validate & fetch products
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product).populate('brand category')
      if (!product || !product.isActive) throw new AppError(`Product not available`, 400)

      let price = product.price
      let stockQuantity = product.stockQuantity

      if (item.variant) {
        const variant = (product.variants as any).id(item.variant)
        if (!variant) throw new AppError('Variant not found', 400)
        price = variant.price
        stockQuantity = variant.stockQuantity
      }

      if (stockQuantity < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400)
      }

      orderItems.push({
        product: product._id,
        variant: item.variant,
        name: product.name,
        image: product.thumbnail,
        sku: product.sku,
        quantity: item.quantity,
        price,
        gstRate: product.gstRate,
        hsn: product.hsn,
      })

      subtotal += price * item.quantity
    }

    // Shipping
    const shippingCharge = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE

    // Coupon
    let discount = 0
    let couponDiscount = 0
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
        $expr: { $lt: ['$usedCount', '$usageLimit'] },
      })

      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.type === 'percentage') {
          couponDiscount = Math.min(
            (subtotal * coupon.value) / 100,
            coupon.maxDiscount || Infinity,
          )
        } else {
          couponDiscount = coupon.value
        }
        discount = couponDiscount
      }
    }

    // GST calculation
    const gstAmount = orderItems.reduce(
      (acc, item) => acc + (item.price * item.quantity * item.gstRate) / (100 + item.gstRate),
      0,
    )

    const total = subtotal + shippingCharge - discount

    // Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: `gabbar-${Date.now()}`,
    })

    // Save order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      razorpayOrderId: rzpOrder.id,
      subtotal,
      discount,
      shippingCharge,
      gstAmount: Math.round(gstAmount * 100) / 100,
      total,
      shippingAddress: { ...shippingAddress, country: 'India' },
      couponCode: couponCode?.toUpperCase(),
      couponDiscount,
    })

    emitToAdmin('new-order', { orderId: order._id, total })

    sendSuccess(res, {
      message: 'Order created',
      data: {
        ...order.toObject(),
        razorpayOrderId: rzpOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
      statusCode: 201,
    })
  } catch (err) {
    next(err)
  }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId } = req.params
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body

    const order = await Order.findById(orderId)
    if (!order) throw new AppError('Order not found', 404)
    if (order.user.toString() !== req.user!._id.toString()) throw new AppError('Unauthorized', 403)

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      throw new AppError('Payment verification failed', 400)
    }

    order.paymentStatus = 'paid'
    order.status = 'confirmed'
    order.razorpayPaymentId = razorpay_payment_id
    order.razorpaySignature = razorpay_signature
    order.timeline.push({
      status: 'confirmed',
      message: 'Payment received. Order confirmed.',
      timestamp: new Date(),
    })

    await order.save()

    // Update stock
    for (const item of order.items) {
      if (item.variant) {
        await Product.updateOne(
          { _id: item.product, 'variants._id': item.variant },
          { $inc: { 'variants.$.stockQuantity': -item.quantity } },
        )
      } else {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity },
        })
      }
    }

    // Increment coupon usage
    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: order.couponCode },
        { $inc: { usedCount: 1 }, $push: { usedBy: order.user } },
      )
    }

    emitToUser(order.user.toString(), 'order-confirmed', { orderNumber: order.orderNumber })
    emitToAdmin('payment-received', { orderId: order._id, amount: order.total })

    await queueEmail({
      to: req.user!.email,
      subject: `Order Confirmed - #${order.orderNumber}`,
      html: `<p>Your order #${order.orderNumber} has been confirmed. Total: ₹${order.total}</p>`,
    })

    await queueInvoice(order._id.toString())

    sendSuccess(res, { message: 'Payment verified. Order confirmed!', data: order })
  } catch (err) {
    next(err)
  }
}

export async function getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)
    const userId = req.user!._id

    const [orders, total] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: userId }),
    ])

    sendSuccess(res, { data: orders, meta: buildMeta(total, page, limit) })
  } catch (err) {
    next(err)
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user!._id,
    }).populate('items.product', 'name slug thumbnail')

    if (!order) throw new AppError('Order not found', 404)
    sendSuccess(res, { data: order })
  } catch (err) {
    next(err)
  }
}
