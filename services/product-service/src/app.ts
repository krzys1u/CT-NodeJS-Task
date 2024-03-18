import type EventEmitter from 'events'
import express, {type Express, type Request} from 'express'
import { createProductController } from './controllers/productController'
import { createProductReviewsController } from './controllers/productReviewsController'
import { type DataSource } from 'typeorm'
import { Product } from './models/Product'
import { Review } from './models/Review'
import {instanceIdMiddleware} from "./middlewares/instanceIdMiddleware";
import {onlyJSONContentType} from "./middlewares/onlyJSONContentType";

export const createApp = (db: DataSource, productReviewChangeListener: EventEmitter): Express => {
  const app = express()

  app.use(express.json())
  app.use(instanceIdMiddleware);
  app.use(onlyJSONContentType);

  const productController = createProductController(db)
  const productReviewsController = createProductReviewsController(db, productReviewChangeListener)

  app.get('/create', async (_, res): Promise<void> => {
    const productRepository = db.getRepository(Product)
    const reviewRepository = db.getRepository(Review)

    const firstProduct = new Product()

    firstProduct.name = 'product1'
    firstProduct.description = 'product1 desc'
    firstProduct.price = 15
    firstProduct.averageRating = 0
    firstProduct.reviews = []

    await productRepository.save(firstProduct)

    const review = new Review()

    review.firstName = 'XD'
    review.reviewText = 'text'
    review.lastName = 'xDDD'
    review.rating = 5

    const secondProduct = new Product()

    secondProduct.name = 'product2'
    secondProduct.description = 'product2 desc'
    secondProduct.price = 30
    secondProduct.averageRating = 0
    secondProduct.reviews = [
      review
    ]

    review.product = secondProduct

    await productRepository.save(secondProduct)
    await reviewRepository.save(review)

    res.send('DATA SAVED')
  })

  app.get('/', (_, res) => res.send(`[${process.env.CT_INSTANCE_ID}] Hello from Product Service`))

  app.use('/products', productController)
  app.use('/product-reviews', productReviewsController)

  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status ?? 500)
    res.json({ message: err.message })
  })

  return app
}
