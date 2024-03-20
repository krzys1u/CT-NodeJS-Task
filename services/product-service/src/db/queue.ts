import amqplib from 'amqplib'

import type { RabbitConfig } from '../types'
import { logger } from '../logger'

export interface QueueClient {
  send: (value: string) => void
}

export const createQueueClient = async (config: RabbitConfig): Promise<QueueClient | undefined> => {
  const queue = 'productReviews'

  try {
    const conn = await amqplib.connect(config.url)

    const channel = await conn.createChannel()

    return {
      send: (value: string): void => {
        channel.sendToQueue(queue, Buffer.from(value))
      }
    }
  } catch (e) {
    logger.error('QUEUE ERROR', e)
  }
}
