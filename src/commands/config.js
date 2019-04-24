
// let _ = require('lodash')
let Promise = require('bluebird')
let { loadConfig } = require('../helpers')
let path = require('path')
let fs = require('fs')
Promise.promisifyAll(fs)
let context = require('../context.js')

// let asyncEach = require('./asyncEach')
// let requestify = require('./requestify')
let inquirer = Promise.promisifyAll(require('inquirer'))

let requireAll = require('require-all')

// let configTargets = require('./configure/targets')
// let configScss = require('./configure/scss')
// let configBabel = require('./configure/babel')
// let configIgnoreFile = require('./configure/ignoreFile')
// let configConcurrency = require('./configure/concurrency')

let quickshotignore = `
# This your '.quickshotignore' file. Anything you put in here will be ignored by quickshot.
# This file uses the same format as a '.gitignore' file.
`

module.exports = async function () {
  let config

  let actions = requireAll({
    dirname: path.join(__dirname, 'config')
  })

  try {
    config = await loadConfig()
  } catch (err) {}

  config = Object.assign({
    concurrency: 20,
    compile_scss: false,
    primary_scss_file: null,
    targets: []
  }, config)

  let choice = {}

  while (choice.action !== 'Save configuration and exit') {
    choice = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'Main Menu',
      choices: [
        'targets',
        'scss',
        // 'babel',
        // 'concurrency',
        'Save configuration and exit'
      ]
    }])

    if (actions[choice.action] != null) {
      await actions[choice.action](config)
    }
  }

  try {
    await fs.statAsync(path.join(process.cwd(), '.quickshot-ignore'))
  } catch (err) {
    await fs.writeFileAsync(path.join(process.cwd(), '.quickshot-ignore'), quickshotignore)
  }

  config.configVersion = context.configVersion
  await fs.writeFileAsync(path.join(process.cwd(), 'quickshot.json'), JSON.stringify(config, null, 2))

  return 'Configuration saved!\n'
}
