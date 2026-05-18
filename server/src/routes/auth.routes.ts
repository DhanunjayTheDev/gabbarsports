import { Router } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/auth'
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/auth.controller'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  password: z.string().min(8).max(128),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', authenticate, logout)
router.post('/refresh-token', refreshToken)
router.post('/forgot-password', validate(z.object({ email: z.string().email() })), forgotPassword)
router.post('/reset-password', validate(z.object({ token: z.string(), password: z.string().min(8) })), resetPassword)
router.get('/me', authenticate, getMe)

export default router
