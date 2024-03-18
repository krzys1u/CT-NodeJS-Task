import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, type Relation} from 'typeorm'
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
    product!: Relation<Product>
}
