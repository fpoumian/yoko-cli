// @flow

import chalk from 'chalk'
import type { ILogger } from './interfaces'

export default function createLogger(): ILogger {
  const themes = {
    error: chalk.whiteBright.bgRed.bold,
    info: chalk.whiteBright.bgBlue.bold,
    success: chalk.whiteBright.bgGreen.bold,
  }

  function error(message: any) {
    console.log(themes.error('ERROR:') + ' ' + chalk.whiteBright.bold(message))
  }

  function info(message: any) {
    console.log(themes.info('INFO:') + ' ' + chalk.whiteBright.bold(message))
  }

  function success(message: any) {
    console.log(
      themes.success('SUCCESS:') + ' ' + chalk.whiteBright.bold(message)
    )
  }

  return {
    error,
    info,
    success,
  }
}
