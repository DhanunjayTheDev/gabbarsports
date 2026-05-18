import { Router } from 'express'
import { createReturnRequest, getMyReturnRequests } from '../controllers/return.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', getMyReturnRequests)
router.post('/', createReturnRequest)

export default router
