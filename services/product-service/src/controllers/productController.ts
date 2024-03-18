import { Router } from 'express'
import { type DataSource } from 'typeorm'

export const createProductController = (db: DataSource): Router => {
  const router = Router()

  router.post('/', () => {})
  router.get('/', () => {})

  router.get('/:id', () => {})
  router.delete(':{i}', () => {})
  router.put('/:id', () => {})

  router.get(':id/reviews', () => {})

  return router
}
