
let _ = require('lodash')
let Promise = require('bluebird')
// let co = require('co')
let path = require('path')
let fs = Promise.promisifyAll(require('fs'))
let url = require('url')
// let axios = require('axios')
let colors = require('colors')
let inquirer = Promise.promisifyAll(require('inquirer'))
let moment = require('moment')
let context = require('./context.js')

let loadConfig = async function () {
  let config

  try {
    config = await fs.readFileAsync(path.join(process.cwd(), 'quickshot.json'), 'utf8')
  } catch (err) {
    throw new Error('Shop configuration is missing, have you run \'quickshot configure\'?')
  }

  try {
    config = JSON.parse(config)
  } catch (err) {
    throw new Error('Shop configuration is corrupt, you may need to delete \'quickshot.json\', and run \'quickshot configure\' again.')
  }

  if (!config.configVersion || config.configVersion < context.configVersion) {
    throw new Error('Shop configuration is from an older incompatible version of quickshot. You need to run \'quickshot configure\' again.')
  }

  Object.assign(context.config, config)

  return config
}

let getTarget = async function (config, argv) {
  let targetName = argv['target'] || null

  let target = null
  if (_.isArray(config.targets)) {
    if (targetName) {
      target = _.find(config.targets, { name: targetName })
      if (!target) {
        throw new Error(`Could not find target '${targetName}'`)
      }
    } else {
      let targetChoices = config.targets.map(function (target) {
        return `[${target.name}] - '${target.theme_name}' @ ${url.parse(target.url).host}`
      })
      if (config.targets.length > 1) {
        let choice = await inquirer.prompt([
          {
            type: 'list',
            name: 'target',
            message: 'Select target',
            default: null,
            choices: targetChoices
          }
        ])
        target = config.targets[_.indexOf(targetChoices, choice.target)]
      } else if (config.targets.length === 1) {
        target = _.first(config.targets)
      }
    }
  } else {
    throw new Error(`No targets configured! Run 'quickshot configure' and create a new target.`)
  }

  // target.auth = 'Basic ' + new Buffer(`${target.api_key}:${target.password}`).toString('base64')
  return target
}

let ts = function () {
  return moment().format('hh:mm:ss a')
}

let log = function (content, color = 'white') {
  let data = null
  let message = null

  if (_.isError(content)) {
    message = content
    data = content
  } else if (_.isObject(content)) {
    if (content.message) {
      message = content.message
    }
    if (content.data) {
      data = content.data
    } else {
      data = content
    }
  } else {
    message = content
  }

  if (message) {
    console.log(colors[color](`${ts()} - ${message}`))
  }

  if (data) {
    console.log(colors[color](`=== START OF OUTPUT ===`))
    console.dir(data, { depth: null })
    console.log(colors[color](`==== END OF OUTPUT ====`))
  }
}

module.exports = {
  loadConfig,
  getTarget,
  log
}
