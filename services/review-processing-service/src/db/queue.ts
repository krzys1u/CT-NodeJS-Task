import { setTimeout } from 'node:timers/promises'

import { logger } from '../logger'

import amqplib, { type Connection, type Message } from 'amqplib'

import type { RabbitConfig } from '../../types'

type QueueHandler = (data: string) => Promise<void>

export interface QueueClient {
  registerHandler: (queue: string, handler: QueueHandler) => Promise<void>
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
      logger.error('CONSUMER ERROR', 'retrying')
    }
  }
}

export const createQueueClient = async (config: RabbitConfig): Promise<QueueClient> => {
  const conn = await createRabbitConnection(config.url)

  return {
    registerHandler: async (queue, handler): Promise<void> => {
      const channel = await conn.createChannel()

      await channel.assertQueue(queue)

      await channel.consume(queue, async (msg: Message | null) => {
        if (msg !== null) {
          await handler(msg.content.toString())

          channel.ack(msg)
        } else {
          logger.log('Consumer cancelled by server')
        }
      })
    }
  }
}
