export const SERVICE_URL = 'http://localhost/product-service'
export const PRODUCTS_ENDPOINT = `${SERVICE_URL}/products`
export const REVIEWS_ENDPOINT = `${SERVICE_URL}/reviews`

interface Product {
  id?: number
  name?: string
  description?: string
  price?: number
  averageRating?: number
  reviews?: []
}

export interface Review {
  id?: number
  firstName?: string
  lastName?: string
  reviewText?: string
  rating?: number
  product?: number
}

export interface ApiError {
  message: string
}

interface ApiResponse<T> {
  status: number
  body: T
  headers: Headers
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
  responseTransformer: 'json' | 'text' = 'json'
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

  const responseBody = (await response[responseTransformer]()) as T

  return {
    status: response.status,
    body: responseBody,
    headers: response.headers
  }
}

export const createProduct = async (product: Product): Promise<ApiResponse<Product>> => await callApi(PRODUCTS_ENDPOINT, 'POST', product)
export const createReview = async (review: Review): Promise<ApiResponse<Review>> => await callApi(REVIEWS_ENDPOINT, 'POST', review)

export const getProduct = async (id: number): Promise<ApiResponse<Product>> => await callApi(`${PRODUCTS_ENDPOINT}/${id}`)
export const getProducts = async (): Promise<ApiResponse<Product[]>> => await callApi(PRODUCTS_ENDPOINT)

export const getProductReviews = async (id: number): Promise<ApiResponse<Review[] | ApiError>> => await callApi(`${PRODUCTS_ENDPOINT}/${id}/reviews`)

export const updateProduct = async (id: number, product: Product): Promise<ApiResponse<Product>> => await callApi(
    `${PRODUCTS_ENDPOINT}/${id}`,
    'PATCH',
    product
)

export const updateReview = async (id: number, review: Review): Promise<ApiResponse<Review>> => await callApi(
    `${REVIEWS_ENDPOINT}/${id}`,
    'PATCH',
    review
)

export const deleteProduct = async (id: number): Promise<ApiResponse<string | ApiError>> => await callApi(
    `${PRODUCTS_ENDPOINT}/${id}`,
    'DELETE',
    null,
    'text'
)

export const deleteReview = async (id: number): Promise<ApiResponse<string | ApiError>> => await callApi(
    `${REVIEWS_ENDPOINT}/${id}`,
    'DELETE',
    null,
    'text'
)
