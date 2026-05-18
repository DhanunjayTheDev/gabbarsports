import { Redis } from 'ioredis'
import logger from '../utils/logger'

let redis: Redis

export async function connectRedis(): Promise<void> {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  })

  redis.on('error', (err) => {
    logger.error('Redis error:', err.message)
  })

  redis.on('connect', () => {
    logger.info('Redis connected')
  })

  await redis.connect()
}

export function getRedis(): Redis {
  if (!redis) throw new Error('Redis not initialized')
  return redis
}

export async function cache<T>(key: string, fn: () => Promise<T>, ttl = 300): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached) as T

  const result = await fn()
  await redis.setex(key, ttl, JSON.stringify(result))
  return result
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) await redis.del(...keys)
}
