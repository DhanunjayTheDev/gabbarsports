import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/response'

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }

    next()
  }
}

export const isAdmin = requireRole('super_admin', 'manager')
export const isSuperAdmin = requireRole('super_admin')
export const isInventoryStaff = requireRole('super_admin', 'manager', 'inventory')
export const isSupport = requireRole('super_admin', 'manager', 'support')
