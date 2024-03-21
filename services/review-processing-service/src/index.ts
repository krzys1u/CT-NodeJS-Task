import { createApp } from './app'
import { logger } from './logger'
import { config } from './config'
import { createQueueClient } from './db/queue'
import { reviewChangeHandler } from './handlers/reviewChangeHandler';

(async () => {
  const app = createApp()

  const { registerHandler } = await createQueueClient(config.rabbit)

  await registerHandler(config.rabbit.productReviewsUpdateQueue, reviewChangeHandler)

  app.listen(process.env.SERVICE_PORT, function () {
    logger.log(`Review processing service app is listening on port ${process.env.SERVICE_PORT}!`)
  })
})().catch(e => { logger.error('Initialisation error', e) })
