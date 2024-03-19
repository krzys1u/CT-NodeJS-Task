import express, { type Express } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import { createProductController } from './controllers/productController'
import { createProductReviewsController } from './controllers/productReviewsController'
import { type DataSource } from 'typeorm'
import { instanceIdMiddleware } from './middlewares/instanceIdMiddleware'
import { onlyJSONContentType } from './middlewares/onlyJSONContentType'
import { type ChangeEmitter } from './aspects/productReviewChangeListener'

import swaggerUi, { type JsonObject } from 'swagger-ui-express'
import fs from 'fs'

export const createApp = (db: DataSource, productReviewChangeListener: ChangeEmitter): Express => {
  const app = express()

  const swaggerDocument: string = fs.readFileSync('./services/product-service/api.json', 'utf8')

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerDocument) as JsonObject))

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
