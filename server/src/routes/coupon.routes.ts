import { Router } from 'express'
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/coupon.controller'
import { authenticate } from '../middleware/auth'
import { isAdmin } from '../middleware/role'

const router = Router()

router.post('/validate', authenticate, validateCoupon)

router.use(authenticate, isAdmin)
router.get('/', getCoupons)
router.post('/', createCoupon)
router.patch('/:id', updateCoupon)
router.delete('/:id', deleteCoupon)

export default router
