import type EventEmitter from 'events'
import { Router } from 'express'
import { type DataSource } from 'typeorm'
//    //eventEmitter.emit('greet');

export const createProductReviewsController = (db: DataSource, productReviewChangeListener: EventEmitter): Router => {
  const router = Router()

  router.post('/', () => {})

  router.delete('/:id', () => {})
  router.patch('/:id', () => {})

  return router
}
