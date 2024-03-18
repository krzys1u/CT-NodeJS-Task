import type EventEmitter from 'events'
import { Router } from 'express'
//    //eventEmitter.emit('greet');

export const createProductReviewsController = (db: any, productReviewChangeListener: EventEmitter): Router => {
  const router = Router()

  router.post('/', () => {})

  router.delete('/:id', () => {})
  router.put('/:id', () => {})

  return router
}
