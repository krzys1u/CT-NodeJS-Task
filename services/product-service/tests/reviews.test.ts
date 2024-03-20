import { beforeEach, afterEach, describe, expect, test } from 'vitest'
import {
  type ApiError,
  buildProduct,
  buildReview,
  createProduct,
  createReview, deleteProduct,
  deleteReview,
  updateReview
} from './utils'

describe('Review creating', () => {
  const product = buildProduct('Test Product', 'Test description', 123)
  const review = buildReview('John', 'Doe', 'Review text', 5)

  beforeEach(async () => {
    const productResponse = await createProduct(product)

    review.product = productResponse.body.id
    product.id = productResponse.body.id
  })

  afterEach(async () => {
    await deleteProduct(product.id!)
  })

  test('Should create new Review', async () => {
    const { status, body } = await createReview(review)

    expect(status).toEqual(201)

    expect(body.id).toBeDefined()
    expect(body.firstName).toEqual(review.firstName)
    expect(body.lastName).toEqual(review.lastName)
    expect(body.reviewText).toEqual(review.reviewText)
    expect(body.rating).toEqual(review.rating)

    await deleteReview(body.id!)
  })

  test('Should fail on validation during new Review creation', async () => {
    const { status, body } = await createReview({
      firstName: 'John',
      lastName: 'Doe',
      reviewText: 'Review Text',
      rating: 5
    })

    expect(status).toEqual(400)

    expect((body as ApiError).message).toEqual('request.body should have required property \'product\'')
  })

  test('Should fail on validation during new Review creation because of rating not between 1-5', async () => {
    const { status, body } = await createReview({
      ...review,
      rating: -1
    })

    expect(status).toEqual(400)

    expect((body as ApiError).message).toEqual('request.body.rating should be >= 1')
  })
})

describe('Update review', () => {
  const product = buildProduct('Test Product', 'Test description', 123)
  const review = buildReview('John', 'Doe', 'Review text', 5)

  beforeEach(async () => {
    const productResponse = await createProduct(product)

    review.product = productResponse.body.id

    const { body } = await createReview(review)

    review.id = body.id
    product.id = productResponse.body.id
  })

  afterEach(async () => {
    await deleteReview(review.id!)
    await deleteProduct(product.id!)

    delete review.id
    delete product.id
  })

  test('Should update review data', async () => {
    const newReviewText = `${review.reviewText} - Edited`

    const { status, body } = await updateReview(review.id!, {
      reviewText: newReviewText
    })

    expect(status).toEqual(200)

    expect(body.id).toEqual(review.id)
    expect(body.firstName).toEqual(review.firstName)
    expect(body.lastName).toEqual(review.lastName)
    expect(body.reviewText).toEqual(newReviewText)
    expect(body.rating).toEqual(review.rating)
  })

  test('Should return 404 for Review which doesn\'t exists', async () => {
    const { status, body } = await updateReview(1234321, {
      reviewText: ''
    })

    expect(status).toEqual(404)

    expect((body as ApiError).message).toEqual('Not Found')
  })

  test('Should return validation error because of wrong body typing', async () => {
    // @ts-expect-error - i need to test validation of wrong data type here
    const { status, body } = await updateReview(1234321, { rating: 'abc' })

    expect(status).toEqual(400)

    expect((body as ApiError).message).toEqual('request.body.rating should be integer')
  })

  test('Should return validation error because of rating not between 1-5', async () => {
    const { status, body } = await updateReview(1234321, {
      rating: 6
    })

    expect(status).toEqual(400)

    expect((body as ApiError).message).toEqual('request.body.rating should be <= 5')
  })
})

describe('Delete review', () => {
  const product = buildProduct('Test Product', 'Test description', 123)
  const review = buildReview('John', 'Doe', 'Review text', 5)

  beforeEach(async () => {
    const productResponse = await createProduct(product)

    review.product = productResponse.body.id

    const { body } = await createReview(review)

    review.id = body.id
    product.id = productResponse.body.id
  })

  afterEach(async () => {
    await deleteProduct(product.id!)
  })

  test('Should delete review', async () => {
    const { status, body } = await deleteReview(review.id!)

    expect(status).toEqual(200)
    expect(body).toEqual('OK')
  })

  test('Should return 404 for Review which doesn\'t exists', async () => {
    const reviewId = 1234321

    const { status, body } = await deleteReview(reviewId)

    expect(status).toEqual(404)
    expect(JSON.parse(body as string).message).toEqual('Not Found')
  })
})
