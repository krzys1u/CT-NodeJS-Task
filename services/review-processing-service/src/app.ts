import express, { type Express } from 'express'

export const createApp = (): Express => {
  const app = express()

  app.use(express.json())

  app.use('/', (_, res) => res.send(`[${process.env.CT_INSTANCE_ID}] Hello from Review Processing Service`))

  return app
}
