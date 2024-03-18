import dotenv from 'dotenv'

import crypto from 'crypto'
import { createApp } from './app'
import { createProductReviewChangeListener } from './aspects/productReviewChangeListener'
dotenv.config()

const instanceId = crypto.randomUUID()

process.env.CT_INSTANCE_ID = instanceId

const productReviewChangeListener = createProductReviewChangeListener()

const app = createApp({}, productReviewChangeListener)

app.listen(process.env.PRODUCT_SERVICE_PORT, function () {
  console.log(`[${instanceId}] Product service app is listening on port ${process.env.PRODUCT_SERVICE_PORT}!`)
})
