declare global {
  interface Error {
    status?: number
  }

  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string
      DB_USER: string
      DB_PASSWORD: string
      DB_DATABASE: string
      REDIS_HOST: string
      REDIS_PORT: string
      REDIS_PASSWORD: string
      CACHE_TIME: string
      RABBIT_URL: string
      PRODUCT_REVIEWS_UPDATE_QUEUE: string
    }
  }
}

export interface DBConfig {
  user: string
  password: string
  database: string
  host: string
}

export interface RedisConfig {
  host: string
  port: string
  password: string
  cacheTime: string
}

export interface RabbitConfig {
  url: string
  productReviewsUpdateQueue: string
}

export interface Config {
  instanceId: string
  database: DBConfig
  redis: RedisConfig
  rabbit: RabbitConfig
}
