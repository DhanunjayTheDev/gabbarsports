import { Request, Response, NextFunction } from 'express'
import Order from '../models/Order'
import Product from '../models/Product'
import User from '../models/User'
import Category from '../models/Category'
import Brand from '../models/Brand'
import Banner from '../models/Banner'
import Inventory from '../models/Inventory'
import ReturnRequest from '../models/ReturnRequest'
import { sendSuccess, AppError } from '../utils/response'
import { getPagination, buildMeta } from '../utils/pagination'
import { generateUniqueSlug } from '../utils/slugify'
import { uploadImage, deleteImage } from '../config/cloudinary'
import { invalidateCache } from '../config/redis'
import { emitToUser } from '../config/socket'

// ── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,
      totalOrders,
      monthOrders,
      totalCustomers,
      newCustomers,
      lowStockCount,
      pendingOrders,
      recentOrders,
      revenueByDay,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'customer', createdAt: { $gte: startOfMonth } }),
      Product.countDocuments({ isActive: true, stockQuantity: { $lte: 10 } }),
      Order.countDocuments({ status: 'pending' }),
      Order.find({ paymentStatus: 'paid' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'firstName lastName email')
        .lean(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ])

    const monthRev = monthRevenue[0]?.total || 0
    const lastMonthRev = lastMonthRevenue[0]?.total || 0
    const revenueGrowth = lastMonthRev > 0 ? ((monthRev - lastMonthRev) / lastMonthRev) * 100 : 0

    sendSuccess(res, {
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: monthRev,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        totalOrders,
        monthOrders,
        totalCustomers,
        newCustomers,
        lowStockCount,
        pendingOrders,
        recentOrders,
        revenueByDay,
      },
    })
  } catch (err) {
    next(err)
  }
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function adminGetProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)
    const { search, category, brand, isActive, isFeatured } = req.query

    const filter: Record<string, any> = {}
    if (search) filter.$text = { $search: search as string }
    if (category) filter.category = category
    if (brand) filter.brand = brand
    if (isActive !== undefined) filter.isActive = isActive === 'true'
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true'

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .populate('brand', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ])

    sendSuccess(res, { data: products, meta: buildMeta(total, page, limit) })
  } catch (err) {
    next(err)
  }
}

export async function adminCreateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = await generateUniqueSlug(req.body.name, Product)
    const product = await Product.create({ ...req.body, slug })
    await invalidateCache('products:*')
    sendSuccess(res, { message: 'Product created', data: product, statusCode: 201 })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) throw new AppError('Product not found', 404)
    await invalidateCache('products:*')
    sendSuccess(res, { message: 'Product updated', data: product })
  } catch (err) {
    next(err)
  }
}

export async function adminDeleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), isActive: false },
      { new: true }
    )
    if (!product) throw new AppError('Product not found', 404)
    await invalidateCache('products:*')
    sendSuccess(res, { message: 'Product deleted' })
  } catch (err) {
    next(err)
  }
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function adminGetOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)
    const { status, paymentStatus, search } = req.query

    const filter: Record<string, any> = {}
    if (status) filter.status = status
    if (paymentStatus) filter.paymentStatus = paymentStatus
    if (search) filter.orderNumber = { $regex: search, $options: 'i' }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ])

    sendSuccess(res, { data: orders, meta: buildMeta(total, page, limit) })
  } catch (err) {
    next(err)
  }
}

export async function adminGetOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name slug thumbnail')
    if (!order) throw new AppError('Order not found', 404)
    sendSuccess(res, { data: order })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, message } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) throw new AppError('Order not found', 404)

    order.status = status
    order.timeline.push({ status, message: message || `Order ${status}`, timestamp: new Date() })
    await order.save()

    emitToUser(order.user.toString(), 'order-status-updated', {
      orderNumber: order.orderNumber,
      status,
    })

    sendSuccess(res, { message: 'Order status updated', data: order })
  } catch (err) {
    next(err)
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function adminCreateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = await generateUniqueSlug(req.body.name, Category)
    const category = await Category.create({ ...req.body, slug })
    sendSuccess(res, { message: 'Category created', data: category, statusCode: 201 })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!category) throw new AppError('Category not found', 404)
    sendSuccess(res, { message: 'Category updated', data: category })
  } catch (err) {
    next(err)
  }
}

export async function adminDeleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), isActive: false },
      { new: true }
    )
    if (!category) throw new AppError('Category not found', 404)
    sendSuccess(res, { message: 'Category deleted' })
  } catch (err) {
    next(err)
  }
}

// ── Brands ────────────────────────────────────────────────────────────────────

export async function adminCreateBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = await generateUniqueSlug(req.body.name, Brand)
    const brand = await Brand.create({ ...req.body, slug })
    sendSuccess(res, { message: 'Brand created', data: brand, statusCode: 201 })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!brand) throw new AppError('Brand not found', 404)
    sendSuccess(res, { message: 'Brand updated', data: brand })
  } catch (err) {
    next(err)
  }
}

export async function adminDeleteBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id)
    if (!brand) throw new AppError('Brand not found', 404)
    sendSuccess(res, { message: 'Brand deleted' })
  } catch (err) {
    next(err)
  }
}

// ── Inventory ─────────────────────────────────────────────────────────────────

export async function getInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)
    const lowStockThreshold = Number(req.query.threshold) || 10

    const filter: Record<string, any> = { isActive: true, deletedAt: null }
    if (req.query.lowStock === 'true') {
      filter.stockQuantity = { $lte: lowStockThreshold }
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select('name sku thumbnail stockQuantity isActive variants category')
        .populate('category', 'name')
        .sort({ stockQuantity: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ])

    sendSuccess(res, { data: products, meta: buildMeta(total, page, limit) })
  } catch (err) {
    next(err)
  }
}

export async function updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { quantity, action, note, variantId } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) throw new AppError('Product not found', 404)

    if (variantId) {
      const variant = (product.variants as any).id(variantId)
      if (!variant) throw new AppError('Variant not found', 400)
      variant.stockQuantity =
        action === 'set' ? quantity : variant.stockQuantity + (action === 'add' ? quantity : -quantity)
      if (variant.stockQuantity < 0) throw new AppError('Stock cannot be negative', 400)
    } else {
      product.stockQuantity =
        action === 'set' ? quantity : product.stockQuantity + (action === 'add' ? quantity : -quantity)
      if (product.stockQuantity < 0) throw new AppError('Stock cannot be negative', 400)
    }

    await product.save()

    await Inventory.findOneAndUpdate(
      { product: product._id, variant: variantId || { $exists: false } },
      {
        $push: {
          history: {
            action: action === 'set' ? 'adjustment' : action === 'add' ? 'restock' : 'sale',
            quantity,
            note,
            performedBy: req.user!._id,
            timestamp: new Date(),
          },
        },
      },
      { upsert: true }
    )

    sendSuccess(res, { message: 'Stock updated', data: product })
  } catch (err) {
    next(err)
  }
}

// ── Banners ───────────────────────────────────────────────────────────────────

export async function getBanners(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banners = await Banner.find().sort({ position: 1 }).lean()
    sendSuccess(res, { data: banners })
  } catch (err) {
    next(err)
  }
}

export async function createBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banner = await Banner.create(req.body)
    sendSuccess(res, { message: 'Banner created', data: banner, statusCode: 201 })
  } catch (err) {
    next(err)
  }
}

export async function updateBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!banner) throw new AppError('Banner not found', 404)
    sendSuccess(res, { message: 'Banner updated', data: banner })
  } catch (err) {
    next(err)
  }
}

export async function deleteBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id)
    if (!banner) throw new AppError('Banner not found', 404)
    if (banner.cloudinaryId) await deleteImage(banner.cloudinaryId)
    sendSuccess(res, { message: 'Banner deleted' })
  } catch (err) {
    next(err)
  }
}

// ── Returns ───────────────────────────────────────────────────────────────────

export async function getReturnRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)
    const { status } = req.query

    const filter: Record<string, any> = {}
    if (status) filter.status = status

    const [returns, total] = await Promise.all([
      ReturnRequest.find(filter)
        .populate('user', 'firstName lastName email')
        .populate('order', 'orderNumber total')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReturnRequest.countDocuments(filter),
    ])

    sendSuccess(res, { data: returns, meta: buildMeta(total, page, limit) })
  } catch (err) {
    next(err)
  }
}

export async function updateReturnStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, adminNotes } = req.body
    const returnReq = await ReturnRequest.findById(req.params.id)
    if (!returnReq) throw new AppError('Return request not found', 404)

    returnReq.status = status
    if (adminNotes) returnReq.adminNotes = adminNotes
    returnReq.timeline.push({ status, message: adminNotes || `Return ${status}`, timestamp: new Date() })
    await returnReq.save()

    emitToUser(returnReq.user.toString(), 'return-status-updated', { returnId: returnReq._id, status })

    sendSuccess(res, { message: 'Return status updated', data: returnReq })
  } catch (err) {
    next(err)
  }
}
