import dotenv from 'dotenv'
import crypto from 'crypto'
import { type Config } from '../types'

dotenv.config()

const instanceId = crypto.randomUUID()

export const config: Config = {
  instanceId,
  rabbit: {
    url: process.env.RABBIT_URL
  }
}
