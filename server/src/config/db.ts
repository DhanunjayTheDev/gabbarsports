import mongoose from 'mongoose'
import logger from '../utils/logger'

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not defined')

  mongoose.set('strictQuery', true)

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected. Attempting reconnect...')
  })

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected')
  })

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })

  logger.info(`MongoDB connected: ${mongoose.connection.host}`)
}
