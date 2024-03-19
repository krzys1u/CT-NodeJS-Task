import express, { type Express } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import { createProductController } from './controllers/productController'
import { createProductReviewsController } from './controllers/productReviewsController'
import { type DataSource } from 'typeorm'
import { instanceIdMiddleware } from './middlewares/instanceIdMiddleware'
import { onlyJSONContentType } from './middlewares/onlyJSONContentType'
import { type ChangeEmitter } from './aspects/productReviewChangeListener'

export const createApp = (db: DataSource, productReviewChangeListener: ChangeEmitter): Express => {
  const app = express()

  app.use(express.json())
  app.use(instanceIdMiddleware)
  app.use(onlyJSONContentType)

  const productController = createProductController(db)
  const productReviewsController = createProductReviewsController(db, productReviewChangeListener)

  app.use(
    OpenApiValidator.middleware({
      apiSpec: './services/product-service/api.json',
      validateRequests: true,
      validateResponses: true,
      validateSecurity: false
    })
  )

  app.use('/products', productController)
  app.use('/reviews', productReviewsController)

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status ?? 500)
    res.json({ message: err.message })
  })

  return app
}
