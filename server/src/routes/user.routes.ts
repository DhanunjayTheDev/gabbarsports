import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/user.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/me', getProfile)
router.patch('/me', updateProfile)
router.patch('/me/change-password', changePassword)

router.get('/me/addresses', getAddresses)
router.post('/me/addresses', addAddress)
router.patch('/me/addresses/:id', updateAddress)
router.delete('/me/addresses/:id', deleteAddress)

export default router
