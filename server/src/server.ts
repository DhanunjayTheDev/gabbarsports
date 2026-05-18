import 'dotenv/config'
import http from 'http'
import app from './app'
import { connectDB } from './config/db'
import { connectRedis } from './config/redis'
import { initSocket } from './config/socket'
import logger from './utils/logger'

const PORT = process.env.PORT || 5000

async function bootstrap() {
  await connectDB()
  await connectRedis()

  const server = http.createServer(app)
  initSocket(server)

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
  })

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...')
    server.close(() => {
      logger.info('HTTP server closed')
      process.exit(0)
    })
  })

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err)
    process.exit(1)
  })

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection:', err)
    server.close(() => process.exit(1))
  })
}

bootstrap()
