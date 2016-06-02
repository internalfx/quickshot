
// let _ = require('lodash')
let Promise = require('bluebird')
let {log, loadConfig} = require('./helpers')
// let axios = require('axios')
let path = require('path')
let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)

// let asyncEach = require('./asyncEach')
// let requestify = require('./requestify')
let inquirer = Promise.promisifyAll(require('inquirer'))

let configTargets = require('./configure/targets')
let configScss = require('./configure/scss')
let configBabel = require('./configure/babel')
let configIgnoreFile = require('./configure/ignoreFile')
let configConcurrency = require('./configure/concurrency')

/* global CONFIGVERSION */

let gitignore = `
# This your '.gitignore file. Anything you put in here will be ignored by quickshot and git.
`

let quickshotignore = `
# This your '.quickshotignore' file. Anything you put in here will be ignored by quickshot.
# This file uses the same format as a '.gitignore' file.
`

module.exports = function *(argv) {
  let config
  try {
    config = yield loadConfig()
  } catch (err) {}

  config = Object.assign({
    compile_babel: false,
    concurrency: 20,
    ignore_file: '.quickshotignore',
    compile_scss: false,
    primary_scss_file: null,
    targets: []
  }, config)

  let choice = {}

  while (choice.action !== 'Save configuration and exit') {
    choice = yield inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'Main Menu',
      choices: [
        'Configure targets',
        'Configure scss',
        'Configure babel',
        'Configure ignore file',
        'Configure concurrency',
        'Save configuration and exit'
      ]
    }])

    if (choice.action === 'Configure targets') {
      config = yield configTargets(config)
    } else if (choice.action === 'Configure scss') {
      config = yield configScss(config)
    } else if (choice.action === 'Configure babel') {
      config = yield configBabel(config)
    } else if (choice.action === 'Configure ignore file') {
      config = yield configIgnoreFile(config)
    } else if (choice.action === 'Configure concurrency') {
      config = yield configConcurrency(config)
    }
  }

  try {
    yield fs.statAsync(path.join(process.cwd(), config.ignore_file))
  } catch (err) {
    if (config.ignore_file === '.gitignore') {
      yield fs.writeFileAsync(path.join(process.cwd(), config.ignore_file), gitignore)
    } else {
      yield fs.writeFileAsync(path.join(process.cwd(), config.ignore_file), quickshotignore)
    }
  }

  config.configVersion = CONFIGVERSION
  yield fs.writeFileAsync('quickshot.json', JSON.stringify(config))

  log('Configuration saved!\n', 'green')
}
