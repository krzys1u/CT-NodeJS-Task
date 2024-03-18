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
  }
}
