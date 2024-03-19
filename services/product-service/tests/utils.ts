export const SERVICE_URL = 'http://localhost/product-service'
export const PRODUCTS_ENDPOINT = `${SERVICE_URL}/products`
export const REVIEWS_ENDPOINT = `${SERVICE_URL}/reviews`

interface Product {
  name: string
  description: string
  price: number
}

interface Review {
  firstName: string
  lastName: string
  reviewText: string
  rating: number
}

interface ApiResponse<T> {
  status: number
  body: T
}

export const buildProduct = (name: string, description: string, price: number): Product => ({
  name, description, price
})

export const buildReview = (firstName: string, lastName: string, reviewText: string, rating: number): Review => ({
  firstName,
  lastName,
  reviewText,
  rating
})

export const callApi = async <T>(
  endpoint: string,
  method: string = 'GET',
  body: Partial<T> | null = null,
  responseTransformer = 'json'
): Promise<ApiResponse<T>> => {
  const response = await fetch(
    endpoint,
    {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      ...(body !== null ? { body: JSON.stringify(body) } : {})
    }
  )

  const responseBody = await response[responseTransformer]()

  return {
    status: response.status,
    body: responseBody
  }
}

export const createProduct = async (product: Product): Promise<ApiResponse<Product>> => await callApi(PRODUCTS_ENDPOINT, 'POST', product)
export const createReview = async (review: Review): Promise<ApiResponse<Review>> => await callApi(REVIEWS_ENDPOINT, 'POST', review)

export const getProduct = async (id): Promise<ApiResponse<Product>> => await callApi(`${PRODUCTS_ENDPOINT}/${id}`)
export const getProducts = async (): Promise<ApiResponse<Product[]>> => await callApi(PRODUCTS_ENDPOINT)

export const getProductReviews = async (id): Promise<ApiResponse<Review[]>> => await callApi(`${PRODUCTS_ENDPOINT}/${id}/reviews`)

export const updateProduct = async (id, product: Product): Promise<ApiResponse<Product>> => await callApi(
    `${PRODUCTS_ENDPOINT}/${id}`,
    'PATCH',
    product
)

export const updateReview = async (id, review: Review): Promise<ApiResponse<Review>> => await callApi(
    `${REVIEWS_ENDPOINT}/${id}`,
    'PATCH',
    review
)

export const deleteProduct = async (id): Promise<ApiResponse<string>> => await callApi(
    `${PRODUCTS_ENDPOINT}/${id}`,
    'DELETE',
    null,
    'text'
)

export const deleteReview = async (id): Promise<ApiResponse<string>> => await callApi(
    `${REVIEWS_ENDPOINT}/${id}`,
    'DELETE',
    null,
    'text'
)
