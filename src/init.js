// @flow

import type { IConfigLoader, IGenerator, ILogger } from './interfaces'

export default (
  generatorFactory: Object => IGenerator,
  configLoader: IConfigLoader,
  logger: ILogger
) =>
  function init(componentName: string, componentOptions: Object): Promise<any> {
    if (typeof componentName === 'undefined') {
      logger.error('componentName is undefined')
      return process.exit(1)
    }

    // Load global configuration object
    return configLoader
      .load()
      .then(config => {
        if (!config) {
          return Promise.reject(new Error('Cannot find configuration file.'))
        }

        try {
          return generatorFactory(config)
        } catch (e) {
          Promise.reject(new Error(e))
        }
      })
      .then((generator: IGenerator) => {
        try {
          generator
            .generate(componentName, componentOptions)
            .on('done', paths => {
              logger.info(paths)
            })
            .on('error', e => {
              logger.error(e)
            })
        } catch (e) {
          Promise.reject(new Error(e))
        }
      })
      .catch(e => {
        logger.error(e)
        process.exit(1)
      })
  }
