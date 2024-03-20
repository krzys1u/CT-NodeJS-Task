import { createClient } from 'redis'

import type { RedisConfig } from '../types'
import { logger } from '../logger'

export interface CacheClient {
  getValue: (key: string) => Promise<string | null>
  setValue: (key: string, value: string) => Promise<void>
  deleteValue: (key: string) => Promise<void>
}

export const createCacheClient = async (config: RedisConfig): Promise<CacheClient> => {
  const { host, port, password } = config
  const redisURL = `redis://:${password}@${host}:${port}`

  const redisClient = createClient({ url: redisURL }).on('error', (e) => {
    logger.error('Failed to create the Redis client with error:')
    logger.error(e)
  })

  try {
    await redisClient.connect()
    logger.info('Connected to Redis successfully!')
  } catch (e) {
    logger.error('Connection to Redis failed with error:')
    logger.error(e)
  }

  return {
    getValue: async (key: string): Promise<string | null> => {
      return await redisClient.get(key)
    },
    setValue: async (key: string, value: string): Promise<void> => {
      await redisClient.set(key, value, {
        EX: parseInt(config.cacheTime)
      })
    },
    deleteValue: async (key: string): Promise<void> => {
      await redisClient.del(key)
    }
  }
}
