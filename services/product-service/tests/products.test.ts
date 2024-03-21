import { beforeAll, afterAll, beforeEach, afterEach, describe, expect, test } from 'vitest'
import {
  type ApiError,
  buildProduct,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct
} from './utils'
import type { Product } from '@ct-nodejs-task/types'

describe('Product creating', () => {
  test('Should create new Product', async () => {
    const product = buildProduct('Test Product', 'Test description', 123)

    const { status, body } = await createProduct(product)

    expect(status).toEqual(201)

    expect(body.id).toBeDefined()
    expect(body.name).toEqual(product.name)
    expect(body.description).toEqual(product.description)
    expect(body.price).toEqual(product.price)
    expect(body.averageRating).toEqual(0)
    expect(body.reviews).toEqual([])

    await deleteProduct(body.id!)
  })

  test('Should fail on validation during new Product creation', async () => {
    const productName = 'Test Product'
    const productDescription = 'Test description'

    const { status, body } = await createProduct({
      name: productName,
      description: productDescription
    })

    expect(status).toEqual(400)

    expect((body as ApiError).message).toEqual('request.body should have required property \'price\'')
  })
})

describe('Product list endpoint', () => {
  const products = [
    buildProduct('Test Product', 'Test description', 123),
    buildProduct('Test Product2', 'Test description2', 231)
  ]

  beforeAll(async () => {
    for (const product of products) {
      const { body } = await createProduct(product)

      product.id = body.id
    }
  })

  afterAll(async () => {
    for (const product of products) {
      if (product.id !== undefined) {
        await deleteProduct(product.id)
      }
    }
  })

  test('Should create new Products and show them on the list', async () => {
    const { status, body } = await getProducts()

    expect(status).toEqual(200)

    for (const product of products) {
      const productFromDB = body.find(item => item.id === product.id) as Product

      expect(product.id).toEqual(productFromDB.id)
      expect(product.name).toEqual(productFromDB.name)
      expect(product.description).toEqual(productFromDB.description)
      expect(product.price).toEqual(productFromDB.price)
    }
  })

  test('Should fail on validation during new Product creation', async () => {
    const productName = 'Test Product'
    const productDescription = 'Test description'

    const { body, status } = await createProduct({
      name: productName,
      description: productDescription
    })

    expect(status).toEqual(400)

    expect((body as ApiError).message).toEqual('request.body should have required property \'price\'')
  })
})

describe('Get product', () => {
  const product = buildProduct('Test Product', 'Test description', 123)

  beforeEach(async () => {
    const { body } = await createProduct(product)

    product.id = body.id
  })

  afterEach(async () => {
    await deleteProduct(product.id!)

    delete product.id
  })

  test('Should return product data', async () => {
    const { status, body } = await getProduct(product.id!)

    expect(status).toEqual(200)

    expect(body.id).toEqual(product.id)
    expect(body.name).toEqual(product.name)
    expect(body.description).toEqual(product.description)
    expect(body.price).toEqual(product.price)
    expect(body.averageRating).toEqual(0)
  })

  test('Should return 404 for Product which doesn\'t exists', async () => {
    const { status, body } = await getProduct(1234321)

    expect(status).toEqual(404)

    expect((body as ApiError).message).toEqual('Not Found')
  })
})

describe('Update product', () => {
  const product = buildProduct('Test Product', 'Test description', 123)

  beforeEach(async () => {
    const { body } = await createProduct(product)

    product.id = body.id
  })

  afterEach(async () => {
    await deleteProduct(product.id!)

    delete product.id
  })

  test('Should update product data', async () => {
    const newDescription = `${product.description} - Edited`

    const { status, body } = await updateProduct(product.id!, {
      description: newDescription
    })

    expect(status).toEqual(200)

    expect(body.id).toEqual(product.id)
    expect(body.name).toEqual(product.name)
    expect(body.description).toEqual(newDescription)
    expect(body.price).toEqual(product.price)
    expect(body.averageRating).toEqual(0)
  })

  test('Should return 404 for Product which doesn\'t exists', async () => {
    const { status, body } = await updateProduct(1234321, {
      description: ''
    })

    expect(status).toEqual(404)

    expect((body as ApiError).message).toEqual('Not Found')
  })

  test('Should return validation error because of wrong body typing', async () => {
    // @ts-expect-error i need to test validation of wrong body typing
    const { status, body } = await updateProduct(1234321, { price: 'abc' })

    expect(status).toEqual(400)

    expect((body as ApiError).message).toEqual('request.body.price should be integer')
  })
})

describe('Delete product', () => {
  const product = buildProduct('Test Product', 'Test description', 123)

  beforeEach(async () => {
    const { body } = await createProduct(product)

    product.id = body.id
  })

  test('Should delete product', async () => {
    const { status, body } = await deleteProduct(product.id!)

    expect(status).toEqual(200)
    expect(body).toEqual('OK')
  })

  test('Should return 404 for Product which doesn\'t exists', async () => {
    const productId = 1234321

    const { body, status } = await deleteProduct(productId)

    expect(status).toEqual(404)
    expect(JSON.parse(body as string).message).toEqual('Not Found')

    const getResponse = await getProduct(productId)

    expect(getResponse.status).toEqual(404)

    expect((getResponse.body as ApiError).message).toEqual('Not Found')
  })
})
