import amqplib from 'amqplib'

import type { RabbitConfig } from '../types'

export interface QueueClient {
  send: (value: string) => void
}

export const createQueueClient = async (config: RabbitConfig): Promise<QueueClient> => {
  const queue = 'productReviews'

  console.log('config', config)

  const conn = await amqplib.connect(config.url)

  const channel = await conn.createChannel()

  return {
    send: (value: string): void => {
      channel.sendToQueue(queue, Buffer.from(value))
    }
  }
}
