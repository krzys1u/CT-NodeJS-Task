import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import {
  type ApiError,
  buildProduct,
  buildReview,
  createProduct, createReview,
  deleteProduct, deleteReview, getProduct,
  getProductReviews, type Review, updateReview
} from './utils'
import { setTimeout } from 'node:timers/promises'

describe('Product reviews get', () => {
  const product = buildProduct('Test Product', 'Test description', 123)
  const reviews = [
    buildReview('John', 'Doe', 'Review text', 1),
    buildReview('Jane', 'Deo', 'Review 2 text', 2),
    buildReview('Jiny', 'Dod', 'Review 3 text', 3)
  ]

  beforeEach(async () => {
    const { body } = await createProduct(product)

    for (const review of reviews) {
      review.product = body.id

      const newReview = await createReview(review)

      review.id = newReview.body.id
    }

    product.id = body.id
  })

  afterEach(async () => {
    if (product.id !== undefined) {
      await deleteProduct(product.id)
    }
    delete product.id
  })

  test('Should return all reviews for product', async () => {
    const { status, body } = await getProductReviews(product.id!)

    expect(status).toEqual(200)

    for (const review of reviews) {
      const matchingReview = (body as Review[]).find(item => item.id === review.id)!

      expect(matchingReview.id).toEqual(review.id)
      expect(matchingReview.firstName).toEqual(review.firstName)
      expect(matchingReview.lastName).toEqual(review.lastName)
      expect(matchingReview.reviewText).toEqual(review.reviewText)
      expect(matchingReview.rating).toEqual(review.rating)
    }
  })

  test('Should return 404 when fetching reviews for not existing product', async () => {
    const { status, body } = await getProductReviews(1234321)

    expect(status).toEqual(404)

    expect((body as ApiError).message).toEqual('Not Found')
  })
})

describe('Product reviews cache', () => {
  const product = buildProduct('Test Product', 'Test description', 123)
  const reviews = [
    buildReview('John', 'Doe', 'Review text', 1),
    buildReview('Jane', 'Deo', 'Review 2 text', 2),
    buildReview('Jiny', 'Dod', 'Review 3 text', 3)
  ]

  beforeEach(async () => {
    const { body } = await createProduct(product)

    for (const review of reviews) {
      review.product = body.id

      const newReview = await createReview(review)

      review.id = newReview.body.id
    }

    product.id = body.id
  })

  afterEach(async () => {
    if (product.id !== undefined) {
      await deleteProduct(product.id)
    }
    for (const review of reviews) {
      delete review.id
    }

    delete product.id
  })

  test('Should cache product reviews', async () => {
    const { status, body, headers } = await getProductReviews(product.id!)

    expect(status).toEqual(200)

    expect(headers.get('x-cache-hit')).toEqual('miss')

    for (const review of reviews) {
      const matchingReview = (body as Review[]).find(item => item.id === review.id)!

      expect(matchingReview.id).toEqual(review.id)
      expect(matchingReview.firstName).toEqual(review.firstName)
      expect(matchingReview.lastName).toEqual(review.lastName)
      expect(matchingReview.reviewText).toEqual(review.reviewText)
      expect(matchingReview.rating).toEqual(review.rating)
    }

    const secondRequest = await getProductReviews(product.id!)

    expect(secondRequest.status).toEqual(200)

    expect(secondRequest.headers.get('x-cache-hit')).toEqual('hit')

    for (const review of reviews) {
      const matchingReview = (secondRequest.body as Review[]).find(item => item.id === review.id)!

      expect(matchingReview.id).toEqual(review.id)
      expect(matchingReview.firstName).toEqual(review.firstName)
      expect(matchingReview.lastName).toEqual(review.lastName)
      expect(matchingReview.reviewText).toEqual(review.reviewText)
      expect(matchingReview.rating).toEqual(review.rating)
    }
  })

  test('Should clean cache when new review is added', async () => {
    const { status, headers } = await getProductReviews(product.id!)

    expect(status).toEqual(200)

    expect(headers.get('x-cache-hit')).toEqual('miss')

    const newReview = await createReview({
      ...buildReview(
        'Jax', 'Dee', 'Review text 3', 4
      ),
      product: product.id
    })

    const secondRequest = await getProductReviews(product.id!)

    const matchingReview = (secondRequest.body as Review[]).find(item => item.id === newReview.body.id)!

    expect(secondRequest.status).toEqual(200)

    expect(secondRequest.headers.get('x-cache-hit')).toEqual('miss')

    expect(matchingReview.id).toEqual(newReview.body.id)
    expect(matchingReview.firstName).toEqual(newReview.body.firstName)
    expect(matchingReview.lastName).toEqual(newReview.body.lastName)
    expect(matchingReview.reviewText).toEqual(newReview.body.reviewText)
    expect(matchingReview.rating).toEqual(newReview.body.rating)
  })

  test('Should clean cache when review is updated', async () => {
    const { status, headers } = await getProductReviews(product.id!)

    expect(status).toEqual(200)

    expect(headers.get('x-cache-hit')).toEqual('miss')

    const newReview = await updateReview((reviews[2]!).id!, {
      lastName: 'Deo'
    })

    const secondRequest = await getProductReviews(product.id!)

    const matchingReview = (secondRequest.body as Review[]).find(item => item.id === newReview.body.id)!

    expect(secondRequest.status).toEqual(200)

    expect(secondRequest.headers.get('x-cache-hit')).toEqual('miss')

    expect(matchingReview.id).toEqual(newReview.body.id)
    expect(matchingReview.firstName).toEqual(newReview.body.firstName)
    expect(matchingReview.lastName).toEqual(newReview.body.lastName)
    expect(matchingReview.reviewText).toEqual(newReview.body.reviewText)
    expect(matchingReview.rating).toEqual(newReview.body.rating)
  })

  test('Should clean cache when review is deleted', async () => {
    const { status, headers } = await getProductReviews(product.id!)

    expect(status).toEqual(200)

    expect(headers.get('x-cache-hit')).toEqual('miss')

    await deleteReview((reviews[1]!).id!)

    const secondRequest = await getProductReviews(product.id!)

    const matchingReview = (secondRequest.body as Review[]).find(item => item.id === (reviews[1]!).id)

    expect(secondRequest.status).toEqual(200)

    expect(secondRequest.headers.get('x-cache-hit')).toEqual('miss')

    expect(matchingReview).toEqual(undefined)
  })
})

describe('Product average rating update', () => {
  const product = buildProduct('Test Product', 'Test description', 123)
  const reviews = [
    buildReview('John', 'Doe', 'Review text', 1),
    buildReview('Jane', 'Deo', 'Review 2 text', 4)
  ]

  beforeEach(async () => {
    const resp = await createProduct(product)

    const body = resp.body

    for (const review of reviews) {
      review.product = body.id

      const newReview = await createReview(review)

      review.id = newReview.body.id
    }

    product.id = body.id

    await setTimeout(500)
  })

  afterEach(async () => {
    if (product.id !== undefined) {
      await deleteProduct(product.id)
    }
    for (const review of reviews) {
      delete review.id
    }

    delete product.id
  })

  test('Should return proper average rating for product', async () => {
    await setTimeout(500)

    const { body } = await getProduct(product.id!)

    expect(body.averageRating).toEqual(2.5)
  })

  test('Should update averageReview when new review is added', async () => {
    const { body } = await getProduct(product.id!)

    expect(body.averageRating).toEqual(2.5)

    await createReview({
      ...buildReview(
        'Jax', 'Dee', 'Review text 3', 4
      ),
      product: product.id
    })

    await setTimeout(500)

    const secondRequest = await getProduct(product.id!)

    expect(secondRequest.body.averageRating).toEqual(3)
  })

  test('Should update averageRating when review is updated', async () => {
    const { body } = await getProduct(product.id!)

    expect(body.averageRating).toEqual(2.5)

    await updateReview((reviews[1]!).id!, {
      rating: 3
    })

    await setTimeout(500)

    const secondRequest = await getProduct(product.id!)

    expect(secondRequest.body.averageRating).toEqual(2)
  })

  test('Should update averageRating when review is deleted', async () => {
    const { body } = await getProduct(product.id!)

    expect(body.averageRating).toEqual(2.5)

    await deleteReview((reviews[0]!).id!)

    await setTimeout(500)

    const secondRequest = await getProduct(product.id!)

    expect(secondRequest.body.averageRating).toEqual(4)
  })
})
