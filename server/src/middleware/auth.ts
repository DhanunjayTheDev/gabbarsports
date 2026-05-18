import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { AppError } from '../utils/response'
import User, { IUser } from '../models/User'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) throw new AppError('Access token required', 401)

    const payload = verifyAccessToken(token)
    const user = await User.findById(payload.userId).select('+refreshTokens')

    if (!user || !user.isActive) throw new AppError('User not found or deactivated', 401)

    req.user = user
    next()
  } catch (err) {
    if (err instanceof AppError) return next(err)
    next(new AppError('Invalid or expired token', 401))
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (token) {
      const payload = verifyAccessToken(token)
      const user = await User.findById(payload.userId)
      if (user?.isActive) req.user = user
    }
  } catch {
    // Optional - ignore errors
  }
  next()
}
