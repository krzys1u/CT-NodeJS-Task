import dotenv from 'dotenv'

import { createApp } from './app'
import crypto from 'crypto'
dotenv.config()

const instanceId = crypto.randomUUID()

process.env.CT_INSTANCE_ID = instanceId

const app = createApp()

app.listen(process.env.REVIEW_PROCESSING_SERVICE_PORT, function () {
  console.log(`[${instanceId}] Review processing service app is listening on port ${process.env.REVIEW_PROCESSING_SERVICE_PORT}!`)
})
