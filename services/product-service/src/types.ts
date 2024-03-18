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
    }
  }
}

export interface DBConfig {
  user: string
  password: string
  database: string
  host: string
}

export interface Config {
  instanceId: string
  database: DBConfig
}
