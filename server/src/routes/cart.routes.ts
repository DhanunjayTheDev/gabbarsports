import { Router } from 'express'
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cart.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', getCart)
router.post('/', addToCart)
router.patch('/items/:itemId', updateCartItem)
router.delete('/items/:itemId', removeFromCart)
router.delete('/', clearCart)

export default router
