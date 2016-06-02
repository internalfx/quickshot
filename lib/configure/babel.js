
let Promise = require('bluebird')
let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
let inquirer = Promise.promisifyAll(require('inquirer'))

module.exports = function *(config) {
  let choice

  choice = yield inquirer.prompt([{
    type: 'confirm',
    name: 'compile_babel',
    message: 'Would you like to enable automatic compiling for babel (es6, jsx) files?',
    default: config.compile_babel
  }])
  config.compile_babel = choice.compile_babel

  return config
}
