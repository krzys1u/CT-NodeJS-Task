import { Router } from 'express'

export const createProductController = (db: any): Router => {
  const router = Router()

  router.post('/', () => {})
  router.get('/', () => {})

  router.get('/:id', () => {})
  router.delete(':{i}', () => {})
  router.put('/:id', () => {})

  router.get(':id/reviews', () => {})

  return router
}
