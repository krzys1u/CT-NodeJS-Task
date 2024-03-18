import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import type { Product as IProduct } from '@ct-nodejs-task/types'
import { Review } from './Review'

@Entity()
export class Product implements IProduct {
  @PrimaryGeneratedColumn()
    id!: number

  @Column()
    name!: string

  @Column()
    description!: string

  @Column()
    price!: number

  @OneToMany(() => Review, (review) => review.product) // note: we will create author property in the Photo class below
    reviews!: Review[]

  @Column()
    averageRating!: number
}
