import makeInit from '../init'

describe('init', () => {
  let configLoader
  let init
  let generatorFactory
  let generator
  let eventListener
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

  beforeEach(() => {
    configLoader = {
      load: jest.fn().mockReturnValue(Promise.resolve(globalConfig)),
    }
    eventListener = {
      on: jest.fn(),
    }

    generator = {
      generate: jest.fn().mockReturnValue(eventListener),
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

  it('should call the event listener returned from the generate method', () => {
    expect.assertions(1)
    return init(COMPONENT_NAME, globalConfig).then(() => {
      console.log(eventListener.on.mock.calls)
      expect(eventListener.on.mock.calls[0][0]).toBe('done')
    })
  })

  describe('when componentName is undefined', () => {
    it('should call the logger error method and the process.exit method with error code 1', () => {
      expect.assertions(2)
      init(undefined, {})
      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(process.exit).toHaveBeenCalledWith(1)
    })

    it('should NOT call the loader.load method', () => {
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
      expect.assertions(2)
      return init(COMPONENT_NAME, {}).then(() => {
        expect(logger.error).toHaveBeenCalledTimes(1)
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
})
