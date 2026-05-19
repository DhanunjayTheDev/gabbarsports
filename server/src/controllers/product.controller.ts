import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product'
import Category from '../models/Category'
import Brand from '../models/Brand'
import { sendSuccess, AppError } from '../utils/response'
import { getPagination, buildMeta } from '../utils/pagination'
import { cache, invalidateCache } from '../config/redis'
import { generateUniqueSlug } from '../utils/slugify'

export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPagination(req)
    const {
      category, brand, search, sort = 'newest', isTrending, isFeatured, isNew,
      priceMin, priceMax, rating, inStock,
    } = req.query

    const filter: Record<string, unknown> = { isActive: true, deletedAt: null }

    if (category) {
      const isObjectId = mongoose.isValidObjectId(category)
      let categoryId: unknown
      if (isObjectId) {
        categoryId = category
      } else {
        const cat = await Category.findOne({ slug: category, isActive: true }).select('_id').lean()
        if (!cat) { sendSuccess(res, { data: [], meta: buildMeta(0, page, limit) }); return }
        categoryId = cat._id
      }
      // Include subcategories so parent nav links show all child products
      const children = await Category.find({ parent: categoryId as mongoose.Types.ObjectId, isActive: true }).select('_id').lean()
      const categoryIds = [categoryId, ...children.map((c) => c._id)]
      filter.category = { $in: categoryIds }
    }

    if (brand) {
      const isObjectId = mongoose.isValidObjectId(brand)
      if (isObjectId) {
        filter.brand = brand
      } else {
        const br = await Brand.findOne({ slug: brand, isActive: true }).select('_id').lean()
        if (br) filter.brand = br._id
        else { sendSuccess(res, { data: [], meta: buildMeta(0, page, limit) }); return }
      }
    }

    if (isTrending === 'true') filter.isTrending = true
    if (isFeatured === 'true') filter.isFeatured = true
    if (isNew === 'true') filter.isNewArrival = true
    if (inStock === 'true') filter.inStock = true

    if (priceMin || priceMax) {
      filter.price = {}
      if (priceMin) (filter.price as Record<string, number>).$gte = Number(priceMin)
      if (priceMax) (filter.price as Record<string, number>).$lte = Number(priceMax)
    }

    if (rating) filter.rating = { $gte: Number(rating) }

    if (search) {
      filter.$text = { $search: search as string }
    }

    const sortMap: Record<string, { [key: string]: 1 | -1 }> = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
      popularity: { reviewCount: -1 },
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('brand', 'name slug logo')
        .sort(sortMap[sort as string] || sortMap.newest)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ])

    sendSuccess(res, {
      data: products,
      meta: buildMeta(total, page, limit),
    })
  } catch (err) {
    next(err)
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params

    const cacheKey = `product:${slug}`
    const cached = await cache(cacheKey, async () => {
      const product = await Product.findOne({ slug, isActive: true, deletedAt: null })
        .populate('category', 'name slug')
        .populate('brand', 'name slug logo')
        .lean()

      if (!product) throw new AppError('Product not found', 404)
      return product
    }, 300)

    sendSuccess(res, { data: cached })
  } catch (err) {
    next(err)
  }
}

export async function getFeaturedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category brand', 'name slug')
      .limit(12)
      .lean()

    sendSuccess(res, { data: products })
  } catch (err) {
    next(err)
  }
}
