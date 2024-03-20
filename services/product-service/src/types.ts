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

export interface Config {
  instanceId: string
  database: DBConfig
  redis: RedisConfig
}
