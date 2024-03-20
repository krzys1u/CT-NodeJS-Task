import EventEmitter from 'events'
import type { ReviewChangeEmitterEventPayload } from '@ct-nodejs-task/types'
import type { CacheClient } from '../db/cache'
import { logger } from '../logger'

export const EVENTS = {
  CREATED: 'ProductReview_CREATED',
  MODIFIED: 'ProductReview_MODIFIED',
  DELETED: 'ProductReview_DELETED'
}

export interface ChangeEmitter {
  emit: (event: string, payload: ReviewChangeEmitterEventPayload) => void
}

export const createProductReviewChangeListener = (cache: CacheClient): ChangeEmitter => {
  const eventEmitter = new EventEmitter()

  Object.entries(EVENTS).forEach(([_, eventName]) => {
    eventEmitter.on(eventName, async (payload) => {
      const { productId } = payload
      await cache.deleteValue(`${productId}`)

      logger.info('action', eventName, payload)
    })
  })

  return {
    emit: (event, payload) => {
      eventEmitter.emit(event, payload)
    }
  }
}
