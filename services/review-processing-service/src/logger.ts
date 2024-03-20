import { config } from './config'

const { instanceId } = config

type LogFunc = (...params: any[]) => void

const prefixMessage = (func: LogFunc, args: any[]): void => {
  func(...[`[${instanceId}`, ...args])
}

export const logger = {
  log: (...args: any[]) => { prefixMessage(console.log, args) },
  info: (...args: any[]) => { prefixMessage(console.info, args) },
  warn: (...args: any[]) => { prefixMessage(console.warn, args) },
  error: (...args: any[]) => { prefixMessage(console.log, args) }
}
