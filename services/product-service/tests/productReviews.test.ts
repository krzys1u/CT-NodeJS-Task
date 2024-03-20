import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import {
  type ApiError,
  buildProduct,
  buildReview,
  createProduct, createReview,
  deleteProduct, deleteReview,
  getProductReviews, type Review, updateReview
} from './utils'

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
    console.log('product.id', product.id)
    await deleteProduct(product.id!)

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
    console.log('product.id2', product.id)

    await deleteProduct(product.id!)

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

    console.log('newReview', newReview)

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
