import { createApp } from './app'
import { createProductReviewChangeListener } from './aspects/productReviewChangeListener'

import { createDataSource } from './db/data-source'

import { config } from './config'
import { createCacheClient } from './db/cache'

const dataSource = createDataSource(config.database)

dataSource.initialize().then(async () => {
  const cache = await createCacheClient(config.redis)

  const productReviewChangeListener = createProductReviewChangeListener(cache)

  const app = createApp(dataSource, productReviewChangeListener, cache)

  app.listen(process.env.SERVICE_PORT, function () {
    console.log(`[${config.instanceId}] Product service app is listening on port ${process.env.SERVICE_PORT}!`)
  })
}).catch(error => { console.log(`[${config.instanceId}] Database initialisation error`, error) })
