
import { createApp } from './app'
import {logger} from "./logger";
import { config } from './config'
import {createQueueClient} from "./db/queue";

(async () => {
  const app = createApp()

  const queue = await createQueueClient(config.rabbit);

  app.listen(process.env.SERVICE_PORT, function () {

    logger.log(`Review processing service app is listening on port ${process.env.SERVICE_PORT}!`)
  })
})();
