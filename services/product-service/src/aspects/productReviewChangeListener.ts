import EventEmitter from 'events'
import type { ReviewChangeEmitterEventPayload } from '@ct-nodejs-task/types'

export const EVENTS = {
  CREATED: 'ProductReview_CREATED',
  MODIFIED: 'ProductReview_MODIFIED',
  DELETED: 'ProductReview_DELETED'
}

export interface ChangeEmitter {
  emit: (event: string, payload: ReviewChangeEmitterEventPayload) => void
}

export const createProductReviewChangeListener = (): ChangeEmitter => {
  const eventEmitter = new EventEmitter()

  Object.entries(EVENTS).forEach(([_, eventName]) => {
    eventEmitter.on(eventName, (payload) => {
      console.log('action', eventName, payload)
    })
  })

  return {
    emit: (event, payload) => {
      eventEmitter.emit(event, payload)
    }
  }
}
