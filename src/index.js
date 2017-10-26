import program from 'commander'
import cosmicconfig from 'cosmiconfig'
import judex from 'judex-component-generator'

import makeInit from './init'
import createLogger from './logger'

const logger = createLogger()
const explorer = cosmicconfig('judex')

const init = makeInit(judex, explorer, logger)

let componentNameValue

// Read Command Line Arguments
program
  .version('0.1.0')
  .arguments('<componentName>')
  .action(function(componentName) {
    componentNameValue = componentName
  })
  .option('-c, --container', 'Generate a Container Component')
  .option('-i, --index', 'Generate an Index File for Component')
  .option('-s, --stylesheet', 'Generate a Stylesheet File for Component')
  .option('-t, --tests', 'Generate a Tests File for Component')
  .option('-e, --es6class', 'Generate an ES6 class component.')
  .parse(process.argv)

// Initialize app
init(componentNameValue, {
  container: program.container,
  index: program.index,
  stylesheet: program.stylesheet,
  tests: program.tests,
  es6class: program.es6class,
})
