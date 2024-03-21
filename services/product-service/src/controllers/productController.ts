import { Router } from 'express'
import { type DataSource } from 'typeorm'
import { Product } from '../models/Product'
import { MethodNotAllowedError, NotFound } from '../errors'
import { generateLinkForResource } from '../utils'
import { Review } from '../models/Review'
import type { CacheClient } from '../db/cache'

export const createProductController = (db: DataSource, cache: CacheClient): Router => {
  const router = Router()

  router.post('/', async (req, res) => {
    const { name, description, price } = req.body

    const productRepository = db.getRepository(Product)

    const product = productRepository.create({
      name,
      description,
      price,
      averageRating: 0,
      reviews: []
    })

    const newProduct = await productRepository.save(product)

    res.status(201)
    res.setHeader('location', generateLinkForResource(req.baseUrl, newProduct.id))
    res.send(newProduct)
  })

  router.get('/', async (req, res) => {
    const productRepository = db.getRepository(Product)

    const products = await productRepository.find()

    res.status(200)
    res.send(products)
  })

  router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id)

    const productRepository = db.getRepository(Product)

    const product = await productRepository.findOneBy({ id })

    if (product === null) {
      next(new NotFound()); return
    }

    res.status(200)
    res.send(product)
  })

  router.delete('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id)

    const productRepository = db.getRepository(Product)

    const product = await productRepository.findOneBy({ id })

    if (product === null) {
      next(new NotFound()); return
    }

    await productRepository.delete(product)

    res.sendStatus(200)
  })

  router.patch('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id)
    const body = req.body

    const productRepository = db.getRepository(Product)

    const product = await productRepository.findOneBy({ id })

    if (product === null) {
      next(new NotFound()); return
    }

    if (body.averageRating !== undefined) {
      await cache.deleteValue(`${id}`)
    }

    const newProduct = await productRepository.save({ id, ...body })

    res.status(200)
    res.send({
      ...product,
      ...newProduct
    })
  })

  router.get('/:id/reviews', async (req, res, next) => {
    const id = parseInt(req.params.id)

    const cachedReviews = (await cache.getValue(`${id}`))!

    const skipCache = req.headers['x-skip-cache']

    if (cachedReviews?.length > 0 && skipCache === undefined) {
      res.status(200)
      res.setHeader('x-cache-hit', 'hit')
      res.send(JSON.parse(cachedReviews))

      return
    }

    const productRepository = db.getRepository(Product)

    const product = await productRepository.findOneBy({ id })

    if (product === null) {
      next(new NotFound()); return
    }

    const reviewRepository = db.getRepository(Review)

    const reviews = await reviewRepository.find({
      where: {
        product
      }
    })

    if (skipCache === undefined) {
      await cache.setValue(`${id}`, JSON.stringify(reviews))
    }

    res.status(200)
    res.setHeader('x-cache-hit', 'miss')
    res.send(reviews)
  })

  router.use('', () => {
    throw new MethodNotAllowedError()
  })

  return router
}
