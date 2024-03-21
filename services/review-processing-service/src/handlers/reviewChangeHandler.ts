import { logger } from '../logger'
import type { ReviewChangeEmitterMessagePayload, ProductReview } from '@ct-nodejs-task/types'

const productServiceUrl = 'http://nginx/product-service/products'

const buildProductUrl = (id: number): string => `${productServiceUrl}/${id}`
const buildProductReviewsUrl = (id: number): string => `${buildProductUrl(id)}/reviews`

export const reviewChangeHandler = async (data: string): Promise<void> => {
  const { payload: { productId } } = JSON.parse(data) as ReviewChangeEmitterMessagePayload

  try {
    const response = await fetch(
      buildProductReviewsUrl(productId),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })

    const productReviews = await response.json() as ProductReview[]

    const count = productReviews.length

    const sum = productReviews.reduce(
      (acc: number, review: ProductReview): number => acc + review.rating,
      0
    )

    const averageRating = count === 0 ? 0 : sum / count

    logger.info('Update average rating for product', productId, 'new rating', averageRating)

    const updateResponse = await fetch(
      buildProductUrl(productId),
      {
        method: 'PATCH',
        body: JSON.stringify({
          averageRating
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const updateBody = await updateResponse.json()

    logger.info('Average rating updated', updateBody)
  } catch (e) {
    logger.error('Fetching product reviews error', e)
  }
}
