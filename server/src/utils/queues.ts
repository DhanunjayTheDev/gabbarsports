import { Queue, Worker, Job } from 'bullmq'
import { getRedis } from '../config/redis'
import logger from './logger'

let emailQueue: Queue
let invoiceQueue: Queue
let notificationQueue: Queue

export function initQueues(): void {
  const connection = getRedis()

  emailQueue = new Queue('emails', { connection })
  invoiceQueue = new Queue('invoices', { connection })
  notificationQueue = new Queue('notifications', { connection })

  // Email worker
  new Worker('emails', async (job: Job) => {
    const { to, subject, html } = job.data
    logger.info(`Sending email to ${to}: ${subject}`)
    // nodemailer integration here
  }, { connection })

  // Invoice worker
  new Worker('invoices', async (job: Job) => {
    const { orderId } = job.data
    logger.info(`Generating invoice for order ${orderId}`)
    // PDF generation here
  }, { connection })

  // Notification worker
  new Worker('notifications', async (job: Job) => {
    const { userId, type, title, message } = job.data
    logger.info(`Sending notification to user ${userId}: ${title}`)
    // Notification creation here
  }, { connection })

  logger.info('BullMQ queues initialized')
}

export function getEmailQueue(): Queue {
  return emailQueue
}

export function getInvoiceQueue(): Queue {
  return invoiceQueue
}

export function getNotificationQueue(): Queue {
  return notificationQueue
}

export async function queueEmail(data: {
  to: string
  subject: string
  html: string
  template?: string
}): Promise<void> {
  await emailQueue.add('send-email', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  })
}

export async function queueInvoice(orderId: string): Promise<void> {
  await invoiceQueue.add('generate-invoice', { orderId }, { attempts: 2 })
}
