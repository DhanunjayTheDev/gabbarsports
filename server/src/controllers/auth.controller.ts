import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import User from '../models/User'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { sendSuccess, AppError } from '../utils/response'
import { queueEmail } from '../utils/queues'

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: '/api/v1/auth',
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, phone, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) throw new AppError('Email already registered', 409)

    const user = await User.create({ name, email, phone, password })
    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role })
    const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role })

    user.refreshTokens.push(refreshToken)
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)

    sendSuccess(res, {
      message: 'Account created successfully',
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
        accessToken,
      },
      statusCode: 201,
    })
  } catch (err) {
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password +refreshTokens')
    if (!user || !user.password) throw new AppError('Invalid email or password', 401)
    if (!user.isActive) throw new AppError('Account deactivated. Contact support.', 403)

    const isMatch = await user.comparePassword(password)
    if (!isMatch) throw new AppError('Invalid email or password', 401)

    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role })
    const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role })

    // Limit stored refresh tokens to 5
    if (user.refreshTokens.length >= 5) user.refreshTokens.shift()
    user.refreshTokens.push(refreshToken)
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS)

    sendSuccess(res, {
      message: 'Login successful',
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isVerified: user.isVerified },
        accessToken,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies.refreshToken
    if (!token) throw new AppError('Refresh token not found', 401)

    const payload = verifyRefreshToken(token)
    const user = await User.findById(payload.userId).select('+refreshTokens')

    if (!user || !user.refreshTokens.includes(token)) {
      throw new AppError('Invalid refresh token', 401)
    }

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== token)
    const newAccessToken = signAccessToken({ userId: user._id.toString(), role: user.role })
    const newRefreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role })
    user.refreshTokens.push(newRefreshToken)
    await user.save({ validateBeforeSave: false })

    res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS)

    sendSuccess(res, { data: { accessToken: newAccessToken } })
  } catch (err) {
    next(err)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies.refreshToken

    if (token && req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: token },
      })
    }

    res.clearCookie('refreshToken', { path: '/api/v1/auth' })
    sendSuccess(res, { message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    // Always return 200 to prevent email enumeration
    if (!user) {
      sendSuccess(res, { message: 'If that email exists, a reset link has been sent.' })
      return
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    await queueEmail({
      to: email,
      subject: 'Gabbar Sports - Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Expires in 1 hour.</p>`,
    })

    sendSuccess(res, { message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    next(err)
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = req.body
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) throw new AppError('Invalid or expired reset token', 400)

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.refreshTokens = []
    await user.save()

    sendSuccess(res, { message: 'Password reset successful. Please login.' })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user!._id)
    if (!user) throw new AppError('User not found', 404)
    sendSuccess(res, { data: user })
  } catch (err) {
    next(err)
  }
}
