import { Router } from 'express'
import { getProductReviews, createReview, markHelpful, deleteReview } from '../controllers/review.controller'
import { authenticate, optionalAuth } from '../middleware/auth'

const router = Router()

router.get('/product/:productId', optionalAuth, getProductReviews)
router.post('/', authenticate, createReview)
router.patch('/:id/helpful', authenticate, markHelpful)
router.delete('/:id', authenticate, deleteReview)

export default router
