import amqplib, { type Connection } from 'amqplib'

import type { RabbitConfig } from '../types'
import { logger } from '../logger'
import { setTimeout } from 'node:timers/promises'

export interface QueueClient {
  send: (value: string) => void
}

const createRabbitConnection = async (url: string): Promise<Connection> => {
  let retries = 0
  while (true) {
    logger.info('trying to connect to rabbit', 'attempt', retries + 1)

    if (retries > 0) {
      await setTimeout(5000)
    }

    retries++

    try {
      const conn = await amqplib.connect(url)

      return conn
    } catch (e) {
      logger.error('Queue ERROR', 'retrying')
    }
  }
}

export const createQueueClient = async (config: RabbitConfig): Promise<QueueClient> => {
  const queue = config.productReviewsUpdateQueue

  const conn = await createRabbitConnection(config.url)

  const channel = await conn.createChannel()

  return {
    send: (value: string): void => {
      channel.sendToQueue(queue, Buffer.from(value))
    }
  }
}
