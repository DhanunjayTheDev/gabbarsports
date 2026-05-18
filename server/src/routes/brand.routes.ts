import { Router } from 'express'
import Brand from '../models/Brand'
import { sendSuccess } from '../utils/response'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean()
    sendSuccess(res, { data: brands })
  } catch (err) { next(err) }
})

export default router
