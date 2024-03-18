import { config } from '../config'
import { type NextFunction, type Request, type Response } from 'express'

export const instanceIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('x-instance-id', config.instanceId)

  next()
}
