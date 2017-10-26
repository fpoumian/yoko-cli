// @flow

import chalk from 'chalk'
import type { ILogger } from './interfaces'

export default function createLogger(): ILogger {
  const themes = {
    error: chalk.whiteBright.bgRed,
    info: chalk.blue,
    infoAlt: chalk.whiteBright.bgBlue,
    success: chalk.green,
    warn: chalk.yellow,
    done: chalk.whiteBright.bgGreen,
  }

  function base(level: string, message: any, label = '') {
    const theme = themes[level]
    console.log(theme(` ${label || level} `) + ' ' + chalk.whiteBright(message))
  }

  function error(message: any) {
    base('error', message, 'ERROR')
  }

  function info(message: any) {
    base('info', message)
  }

  function infoAlt(message: any) {
    base('infoAlt', message, 'INFO')
  }

  function warn(message: any) {
    base('warn', message)
  }

  function success(message: any) {
    base('success', message)
  }

  function done(message: any) {
    base('done', message, 'DONE')
  }

  return {
    error,
    info,
    infoAlt,
    success,
    warn,
    done,
  }
}
