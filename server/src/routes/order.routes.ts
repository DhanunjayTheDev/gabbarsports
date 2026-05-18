import { Router } from 'express'
import { createOrder, verifyPayment, getMyOrders, getOrderById } from '../controllers/order.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.post('/', createOrder)
router.post('/:id/verify-payment', verifyPayment)
router.get('/my-orders', getMyOrders)
router.get('/:id', getOrderById)

export default router
