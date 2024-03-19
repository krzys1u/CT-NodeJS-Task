import { type NextFunction, type Request, type Response } from 'express'
import { UnsupportedMediaType } from '../errors'

export const onlyJSONContentType = (req: Request, res: Response, next: NextFunction): void => {
  if (![
    req.headers['content-type'],
    req.headers.accept
  ].includes('application/json')) {
    throw new UnsupportedMediaType()
  }

  next()
}
