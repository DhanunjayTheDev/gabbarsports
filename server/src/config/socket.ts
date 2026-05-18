import { Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import logger from '../utils/logger'

let io: SocketServer

export function initSocket(server: HttpServer): SocketServer {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`)

    socket.on('join-admin', () => {
      socket.join('admin-room')
    })

    socket.on('join-user', (userId: string) => {
      socket.join(`user-${userId}`)
    })

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

export function getIO(): SocketServer {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}

export function emitToAdmin(event: string, data: unknown): void {
  getIO().to('admin-room').emit(event, data)
}

export function emitToUser(userId: string, event: string, data: unknown): void {
  getIO().to(`user-${userId}`).emit(event, data)
}
