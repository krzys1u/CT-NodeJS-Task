import { logger } from '../logger'

import amqplib, { type Message } from 'amqplib'

import type { RabbitConfig } from '../../types'
//
// export interface QueueClient {
//     send: (value: string) => void
// }

export const createQueueClient = async (config: RabbitConfig): Promise<void> => {
  const queue = 'productReviews'

  try {
    const conn = await amqplib.connect(config.url)

    const channel = await conn.createChannel()

    await channel.assertQueue(queue)

    // Listener
    await channel.consume(queue, (msg: Message | null) => {
      if (msg !== null) {
        logger.log('Received:', msg.content.toString())
        channel.ack(msg)
      } else {
        logger.log('Consumer cancelled by server')
      }
    })
  } catch (e) {
    logger.error('CONSUMER ERROR', e)
    process.exit(1)
  }
}
