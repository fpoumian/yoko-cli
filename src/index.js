#!/usr/bin/env node

const program = require('commander')

let componentNameValue

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
