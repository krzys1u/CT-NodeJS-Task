import dotenv from 'dotenv'
import crypto from 'crypto'
import { type Config } from './types'

dotenv.config()

const instanceId = crypto.randomUUID()

export const config: Config = {
  instanceId,
  database: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    cacheTime: process.env.CACHE_TIME
  },
  rabbit: {
    url: process.env.RABBIT_URL,
    productReviewsUpdateQueue: process.env.PRODUCT_REVIEWS_UPDATE_QUEUE
  }
}
