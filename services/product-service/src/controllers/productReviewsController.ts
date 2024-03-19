import { Router } from 'express'
import { type DataSource } from 'typeorm'
import { Product } from '../models/Product'
import { Review } from '../models/Review'
import { generateLinkForResource } from '../utils'
import { BadRequest, NotFound } from '../errors'
import { type ChangeEmitter, EVENTS } from '../aspects/productReviewChangeListener'

export const createProductReviewsController = (db: DataSource, productReviewChangeListener: ChangeEmitter): Router => {
  const router = Router()

  router.post('/', async (req, res, next) => {
    const productId = parseInt(req.body.product as string)
    const rating = req.body.rating

    if (rating < 1 || rating > 5) {
      next(new BadRequest('Rating have to be between 1 and 5')); return
    }

    const reviewRepository = db.getRepository(Review)
    const productRepository = db.getRepository(Product)

    const product = await productRepository.findOneBy({ id: productId })

    if (product === null) {
      next(new NotFound()); return
    }

    const reviewToSave = {
      ...req.body,
      product
    }

    const review = reviewRepository.create(reviewToSave as Review)

    const newReview = await reviewRepository.save(review)

    productReviewChangeListener.emit(EVENTS.CREATED, {
      reviewId: newReview.id,
      productId: newReview.product.id
    })

    res.status(201)
    res.setHeader('location', generateLinkForResource(req.baseUrl, newReview.id))
    res.send(newReview)
  })

  router.delete('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id)

    const reviewRepository = db.getRepository(Review)

    const reviews = await reviewRepository.find({
      where: {
        id
      },
      relations: ['product'],
      select: {
        product: {
          id: true
        }
      }
    })

    if (reviews.length === 0) {
      next(new NotFound()); return
    }

    const review = reviews[0]!

    await reviewRepository.delete(review)

    productReviewChangeListener.emit(EVENTS.DELETED, {
      reviewId: review.id,
      productId: review.product.id
    })

    res.sendStatus(200)
  })

  router.patch('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id)
    const body = req.body
    const rating = body.rating

    if (rating < 1 || rating > 5) {
      next(new BadRequest('Rating have to be between 1 and 5')); return
    }

    const reviewRepository = db.getRepository(Review)

    const reviews = await reviewRepository.find({
      where: {
        id
      },
      relations: ['product'],
      select: {
        product: {
          id: true
        }
      }
    })

    if (reviews.length === 0) {
      next(new NotFound()); return
    }

    const review = reviews[0]!

    const newReview = await reviewRepository.save({
      id,
      ...body,
      product: review?.product
    })

    productReviewChangeListener.emit(EVENTS.MODIFIED, {
      reviewId: review.id,
      productId: review.product.id
    })

    res.status(200)
    res.send({
      ...review,
      ...newReview
    })
  })

  return router
}
