import { createApp } from './app'
import { createProductReviewChangeListener } from './aspects/productReviewChangeListener'

import { createDataSource } from './db/data-source'

import { config } from './config'

process.env.CT_INSTANCE_ID = config.instanceId

const productReviewChangeListener = createProductReviewChangeListener()

const dataSource = createDataSource(config.database)

dataSource.initialize().then(async () => {
  const app = createApp(dataSource, productReviewChangeListener)

  app.listen(process.env.SERVICE_PORT, function () {
    console.log(`[${config.instanceId}] Product service app is listening on port ${process.env.SERVICE_PORT}!`)
  })
}).catch(error => { console.log(`[${config.instanceId}] Database initialisation error`, error) })
