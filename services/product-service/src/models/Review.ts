import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation, JoinColumn } from 'typeorm'
import type { ProductReview } from '@ct-nodejs-task/types'
import { Product } from './Product'

@Entity()
export class Review implements ProductReview {
  @PrimaryGeneratedColumn()
    id!: number

  @Column()
    firstName!: string

  @Column()
    lastName!: string

  @Column()
    reviewText!: string

  @Column()
    rating!: number

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
    product!: Relation<Product>
}
