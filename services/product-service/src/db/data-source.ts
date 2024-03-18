import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Product } from '../models/Product'
import { Review } from '../models/Review'
import { type DBConfig } from '../types'

export const createDataSource = (config: DBConfig): DataSource => {
  return new DataSource({
    type: 'postgres',
    host: config.host,
    port: 5432,
    username: config.user,
    password: config.password,
    database: config.database,
    synchronize: true,
    logging: false,
    entities: [
      Product,
      Review
    ],
    migrations: [],
    subscribers: []
  }
  )
}
