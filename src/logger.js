// @flow

import chalk from 'chalk'
import type { ILogger } from './interfaces'

export default function createLogger(): ILogger {
  const themes = {
    ERROR: chalk.whiteBright.bgRed.bold,
    INFO: chalk.whiteBright.bgBlue.bold,
    SUCCESS: chalk.whiteBright.bgGreen.bold,
    WARN: chalk.whiteBright.bgYellow.bold,
  }

  function base(level: string, message: any) {
    const theme = themes[level]
    console.log(theme(`${level}:`) + ' ' + chalk.whiteBright.bold(message))
  }

  function error(message: any) {
    base('ERROR', message)
  }

  function info(message: any) {
    base('INFO', message)
  }

  function warn(message: any) {
    base('WARN', message)
  }

  function success(message: any) {
    base('SUCCESS', message)
  }

  return {
    error,
    info,
    success,
    warn,
  }
}
