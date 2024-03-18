export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  reviews: ProductReview[];
  averageRating: number;
}

export interface ProductReview {
  id: number;
  firstName: string;
  lastName: string;
  reviewText: string;
  rating: number;
}
