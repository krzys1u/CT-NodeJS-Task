import type EventEmitter from 'events'
import express, { type Express } from 'express'
import { createProductController } from './controllers/productController'
import { createProductReviewsController } from './controllers/productReviewsController'

export const createApp = (db: any, productReviewChangeListener: EventEmitter): Express => {
  const app = express()

  app.use(express.json())

  const productcontroller = createProductController(db)
  const productReviewsController = createProductReviewsController(db, productReviewChangeListener)

  app.use('/', (_, res) => res.send(`[${process.env.CT_INSTANCE_ID}] Hello from Product Service`))

  app.use('/products', productcontroller)
  app.use('/product-reviews', productReviewsController)

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status ?? 500)
    res.json({ message: err.message, error: err.stack })
  })

  return app
}
