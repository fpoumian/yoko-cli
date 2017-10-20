/* eslint-disable prefer-promise-reject-errors */
// @flow

import type { IConfigLoader, IGenerator, ILogger } from './interfaces'
import messages from './messages'

export default (
  createGenerator: Object => IGenerator,
  configLoader: IConfigLoader,
  logger: ILogger
) =>
  function init(
    componentName: string,
    componentOptions: Object
  ): Promise<any> | void {
    if (typeof componentName === 'undefined') {
      logger.error(messages.ON_COMPONENT_NAME_UNDEFINED)
      return process.exit(1)
    }

    // Load global configuration object
    return configLoader
      .load(process.cwd())
      .then(configSearchResult => {
        if (!configSearchResult) {
          return Promise.reject(messages.ON_GLOBAL_CONFIG_NOT_FOUND)
        }

        try {
          return createGenerator(configSearchResult.config)
        } catch (e) {
          let errorMessage
          if (e instanceof TypeError) {
            errorMessage = messages.ON_BAD_CONFIG_ERROR
          } else {
            errorMessage = messages.ON_GENERATE_ERROR
          }
          return Promise.reject(`${errorMessage}: ${e.message}`)
        }
      })
      .then((generator: IGenerator) => {
        generator
          .on('initGenerator', () => {
            logger.info(messages.ON_INIT_GENERATOR)
          })
          .on('pluginsRegistered', plugins => {
            logger.info(messages.ON_PLUGINS_REGISTERED)
            logger.info(plugins)
          })
          .on('pluginsLoaded', plugins => {
            logger.info(messages.ON_PLUGINS_LOADED)
            logger.info(plugins)
          })
          .on('cannotLoadPlugin', pluginName => {
            logger.warn(messages.ON_CANNOT_LOAD_PLUGIN)
            logger.warn(pluginName)
          })

        try {
          generator
            .generate(componentName, componentOptions)
            .on('start', () => {
              logger.info(messages.ON_GENERATE_START)
            })
            .on('done', paths => {
              logger.success(messages.ON_GENERATE_DONE)
              logger.success(paths.root)
            })
            .on('error', e => {
              logger.error(messages.ON_GENERATE_ERROR)
              logger.error(componentName)
              logger.error(e)
              process.exit(1)
            })
        } catch (e) {
          // eslint-disable-next-line no-unused-vars
          let errorMessage
          if (e instanceof TypeError) {
            errorMessage = messages.ON_GENERATE_TYPE_ERROR
          } else {
            errorMessage = messages.ON_GENERATE_ERROR
          }
          return Promise.reject(
            `${messages.ON_GENERATE_TYPE_ERROR}: ${e.message}`
          )
        }
      })
      .catch(e => {
        logger.error(e)
        process.exit(1)
      })
  }
