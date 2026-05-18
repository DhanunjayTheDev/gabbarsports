import { Response } from 'express'

interface SuccessOptions<T> {
  message?: string
  data?: T
  meta?: Record<string, unknown>
  statusCode?: number
}

export function sendSuccess<T>(res: Response, options: SuccessOptions<T> = {}): Response {
  const { message = 'Success', data = null, meta, statusCode = 200 } = options
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  })
}

export function sendError(res: Response, message: string, statusCode = 400, errors?: unknown): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors != null ? { errors } : {}),
  })
}

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}
