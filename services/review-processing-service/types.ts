declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RABBIT_URL: string
      PRODUCT_REVIEWS_UPDATE_QUEUE: string
    }
  }
}

export interface RabbitConfig {
  url: string
  productReviewsUpdateQueue: string
}

export interface Config {
  instanceId: string
  rabbit: RabbitConfig
}
