import EventEmitter from 'events'
import path from 'path'

import makeInit from '../init'
import messages from '../messages'

describe('init', () => {
  let configLoader
  let init
  let generatorFactory
  let generator
  let logger

  const COMPONENT_NAME = 'TestComponent'
  const globalConfig = {
    paths: {
      components: './components',
      containers: './containers',
      templates: './templates',
    },
    extensions: {
      js: {
        main: 'jsx',
      },
    },
  }

  const componentResultPaths = {
    root: path.resolve(__dirname),
    main: path.resolve(__dirname, COMPONENT_NAME),
  }

  beforeEach(() => {
    configLoader = {
      load: jest.fn().mockReturnValue(
        Promise.resolve({
          config: globalConfig,
        })
      ),
    }

    generator = {
      generate: jest.fn().mockImplementation(() => {
        const eventEmitter = new EventEmitter()
        process.nextTick(() => {
          eventEmitter.emit('start')
          eventEmitter.emit('done', componentResultPaths)
        })
        return eventEmitter
      }),
    }
    generatorFactory = jest.fn().mockReturnValue(generator)
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    }
    init = makeInit(generatorFactory, configLoader, logger)
    process.exit = jest.fn()
  })

  it('should call the configLoader load method once', () => {
    expect.assertions(1)
    init(COMPONENT_NAME, {})
    expect(configLoader.load).toHaveBeenCalledTimes(1)
  })

  it('should call generatorFactory with the globalConfig object', () => {
    expect.assertions(1)
    return init(COMPONENT_NAME, {}).then(() => {
      expect(generatorFactory).toHaveBeenCalledWith(globalConfig)
    })
  })

  it('should call the generator.generate method once', () => {
    expect.assertions(1)
    return init(COMPONENT_NAME, globalConfig).then(() => {
      expect(generator.generate).toHaveBeenCalledTimes(1)
    })
  })

  it('should call the generator.generate method with the component name and the global config as arguments', () => {
    expect.assertions(1)
    return init(COMPONENT_NAME, globalConfig).then(() => {
      expect(generator.generate).toHaveBeenCalledWith(
        COMPONENT_NAME,
        globalConfig
      )
    })
  })

  it('should call the logger.info method with starting message', done => {
    expect.assertions(1)
    return init(COMPONENT_NAME, globalConfig).then(() => {
      process.nextTick(() => {
        expect(logger.info).toHaveBeenCalledWith(messages.ON_GENERATE_START)
        done()
      })
    })
  })

  it('should call the logger.info method with the succcess message and component paths', done => {
    expect.assertions(2)
    return init(COMPONENT_NAME, globalConfig).then(() => {
      process.nextTick(() => {
        expect(logger.info).toHaveBeenCalledWith(messages.ON_GENERATE_DONE)
        expect(logger.info).toHaveBeenCalledWith(componentResultPaths.root)
        done()
      })
    })
  })

  describe('when componentName is undefined', () => {
    it('should call the logger error method and the process.exit method with error code 1', () => {
      expect.assertions(3)
      init(undefined, {})
      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledWith(
        messages.ON_COMPONENT_NAME_UNDEFINED
      )
      expect(process.exit).toHaveBeenCalledWith(1)
    })

    it('should NOT call the loader.load method', () => {
      expect.assertions(1)
      init(undefined, {})
      expect(configLoader.load).not.toHaveBeenCalled()
    })
  })

  describe('when loader.load method returns null (i.e. global config was not found)', () => {
    beforeEach(() => {
      configLoader = {
        load: jest.fn().mockReturnValue(Promise.resolve(null)),
      }
      init = makeInit(generatorFactory, configLoader, logger)
    })

    it('should call the logger error method and the process.exit method with error code 1', () => {
      expect.assertions(3)
      return init(COMPONENT_NAME, {}).then(() => {
        expect(logger.error).toHaveBeenCalledTimes(1)
        expect(logger.error).toHaveBeenCalledWith(
          messages.ON_GLOBAL_CONFIG_NOT_FOUND
        )
        expect(process.exit).toHaveBeenCalledWith(1)
      })
    })

    it('should NOT call generatorFactory', () => {
      expect.assertions(1)
      return init(COMPONENT_NAME, {}).then(() => {
        expect(generatorFactory).not.toHaveBeenCalled()
      })
    })
  })

  describe('when the generatorFactory throws a TypeError', () => {
    beforeEach(() => {
      generatorFactory = jest.fn().mockImplementation(() => {
        throw new TypeError('The error message')
      })
      init = makeInit(generatorFactory, configLoader, logger)
    })

    it('should call the logger error method and the process.exit method with error code 1', () => {
      expect.assertions(2)
      return init(COMPONENT_NAME, {}).then(() => {
        expect(logger.error).toHaveBeenCalledWith(messages.ON_BAD_CONFIG_ERROR)
        expect(process.exit).toHaveBeenCalledWith(1)
      })
    })
  })

  describe('when the generate method throws a TypeError', () => {
    beforeEach(() => {
      generator = {
        generate: jest.fn().mockImplementation(() => {
          throw new TypeError('The error message')
        }),
      }
      generatorFactory = jest.fn().mockReturnValue(generator)
      init = makeInit(generatorFactory, configLoader, logger)
    })

    it('should call the logger error method and the process.exit method with error code 1', () => {
      expect.assertions(2)
      return init(COMPONENT_NAME, {}).then(() => {
        expect(logger.error).toHaveBeenCalledWith(
          messages.ON_GENERATE_TYPE_ERROR
        )
        expect(process.exit).toHaveBeenCalledWith(1)
      })
    })
  })

  describe('when generate method emits an error', () => {
    beforeEach(() => {
      generator = {
        generate: jest.fn().mockImplementation(() => {
          const eventEmitter = new EventEmitter()
          process.nextTick(() => {
            eventEmitter.emit('start')
            eventEmitter.emit('error', 'The error message')
          })
          return eventEmitter
        }),
      }
      generatorFactory = jest.fn().mockReturnValue(generator)
      init = makeInit(generatorFactory, configLoader, logger)
    })

    it('should call the logger error method and the process.exit method with error code 1', done => {
      expect.assertions(4)
      init(COMPONENT_NAME, {}).then(() => {
        process.nextTick(() => {
          expect(logger.info).toHaveBeenCalledWith(messages.ON_GENERATE_START)
          expect(logger.error).toHaveBeenCalledWith(messages.ON_GENERATE_ERROR)
          expect(logger.error).toHaveBeenCalledWith(COMPONENT_NAME)
          expect(process.exit).toHaveBeenCalledWith(1)
          done()
        })
      })
    })
  })
})
