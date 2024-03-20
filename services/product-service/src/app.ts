import express, { type Express, Router } from 'express'
import * as OpenApiValidator from 'express-openapi-validator'
import { createProductController } from './controllers/productController'
import { createProductReviewsController } from './controllers/productReviewsController'
import { type DataSource } from 'typeorm'
import { instanceIdMiddleware } from './middlewares/instanceIdMiddleware'
import { onlyJSONContentType } from './middlewares/onlyJSONContentType'
import { type ChangeEmitter } from './aspects/productReviewChangeListener'

import swaggerUi, { type JsonObject } from 'swagger-ui-express'
import fs from 'fs'
import type { CacheClient } from './db/cache'

export const createApp = (db: DataSource, productReviewChangeListener: ChangeEmitter, cache: CacheClient): Express => {
  const app = express()

  const swaggerDocument: string = fs.readFileSync('./services/product-service/api.json', 'utf8')

  const productController = createProductController(db, cache)
  const productReviewsController = createProductReviewsController(db, productReviewChangeListener)

  const router = Router()

  app.use('/product-service/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerDocument) as JsonObject))

  app.use(express.json())
  app.use(instanceIdMiddleware)
  app.use(onlyJSONContentType)

  router.use(
    OpenApiValidator.middleware({
      apiSpec: './services/product-service/api.json',
      validateRequests: true,
      validateResponses: true,
      validateSecurity: false
    })
  )

  router.use('/products', productController)
  router.use('/reviews', productReviewsController)

  app.use('/product-service', router)

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status ?? 500)
    res.json({ message: err.message })
  })

  return app
}
