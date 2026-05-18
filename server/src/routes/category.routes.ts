import { Router } from 'express'
import Category from '../models/Category'
import { sendSuccess } from '../utils/response'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean()
    sendSuccess(res, { data: categories })
  } catch (err) { next(err) }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    if (!category) { res.status(404).json({ success: false, message: 'Category not found' }); return }
    sendSuccess(res, { data: category })
  } catch (err) { next(err) }
})

export default router
