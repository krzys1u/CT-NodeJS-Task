import EventEmitter from 'events'

export const EVENTS = [
  'ProductReview_ADDED',
  'ProductReview_MODIFIED',
  'ProductReview_DELETED'
]

export const createProductReviewChangeListener = (): EventEmitter => {
  const eventEmitter = new EventEmitter()

  EVENTS.forEach((eventName: typeof EVENTS[number]) => {
    eventEmitter.on(eventName, (payload) => {
      console.log('action', eventName, payload)
    })
  })

  return eventEmitter
}
