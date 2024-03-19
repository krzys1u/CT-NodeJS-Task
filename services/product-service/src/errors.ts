export class UnsupportedMediaType extends Error {
  constructor () {
    super('Unsupported Media Type')

    this.status = 415
  }
}

export class MethodNotAllowedError extends Error {
  constructor () {
    super('Method not allowed')

    this.status = 405
  }
}

export class NotFound extends Error {
  constructor () {
    super('Not Found')

    this.status = 404
  }
}

export class BadRequest extends Error {
  constructor (message = 'Bad Request') {
    super(message)

    this.status = 400
  }
}
