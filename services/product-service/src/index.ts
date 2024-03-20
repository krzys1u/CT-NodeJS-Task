import { createApp } from './app'
import { createProductReviewChangeListener } from './aspects/productReviewChangeListener'

import { createDataSource } from './db/data-source'

import { config } from './config'
import { createCacheClient } from './db/cache'
import { createQueueClient } from './db/queue'
import { logger } from './logger'

const dataSource = createDataSource(config.database)

dataSource.initialize().then(async () => {
  const cache = await createCacheClient(config.redis)
  console.log('try to create queue client')
  const queue = await createQueueClient(config.rabbit)

  const productReviewChangeListener = createProductReviewChangeListener(cache, queue)

  const app = createApp(dataSource, productReviewChangeListener, cache)

  app.listen(process.env.SERVICE_PORT, function () {
    logger.log(`[${config.instanceId}] Product service app is listening on port ${process.env.SERVICE_PORT}!`)
  })
}).catch(error => { logger.error(`[${config.instanceId}] Database initialisation error`, error) })
