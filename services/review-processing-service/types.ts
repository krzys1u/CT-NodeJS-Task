declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RABBIT_URL: string
    }
  }
}

export interface RabbitConfig {
  url: string
}

export interface Config {
  instanceId: string
  rabbit: RabbitConfig
}
