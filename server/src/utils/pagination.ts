import { Request } from 'express'

export interface PaginationOptions {
  page: number
  limit: number
  skip: number
}

export function getPagination(req: Request): PaginationOptions {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 12))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export function buildMeta(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit)
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}
