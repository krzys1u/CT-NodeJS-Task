import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import {
  buildProduct,
  buildReview,
  createProduct, createReview,
  deleteProduct,
  getProductReviews

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
    await deleteProduct(product.id)
  })

  test('Should return all reviews for product', async () => {
    const { status, body } = await getProductReviews(product.id)

    expect(status).toEqual(200)

    for (const review of reviews) {
      const matchingReview = body.find(item => item.id === review.id)

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

    expect(body.message).toEqual('Not Found')
  })
})
