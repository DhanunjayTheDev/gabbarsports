import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import { rateLimit } from 'express-rate-limit'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import categoryRoutes from './routes/category.routes'
import brandRoutes from './routes/brand.routes'
import orderRoutes from './routes/order.routes'
import cartRoutes from './routes/cart.routes'
import userRoutes from './routes/user.routes'
import couponRoutes from './routes/coupon.routes'
import adminRoutes from './routes/admin.routes'
import uploadRoutes from './routes/upload.routes'
import reviewRoutes from './routes/review.routes'
import returnRoutes from './routes/return.routes'

const app = express()

// Trust proxy for Vercel/Railway
app.set('trust proxy', 1)

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

// Strict auth limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts.' },
})

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(compression())

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/v1/auth', authLimiter, authRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/brands', brandRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/coupons', couponRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/upload', uploadRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/returns', returnRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

export default app
