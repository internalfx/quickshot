
let _ = require('lodash')
let Promise = require('bluebird')
let co = require('co')
let path = require('path')
let fs = Promise.promisifyAll(require('fs'))
let axios = require('axios')
let colors = require('colors')
let inquirer = require('inquirer')
let moment = require('moment')
let dive = require('dive')

Promise.promisifyAll(inquirer)

/* global CONFIGVERSION */

// var question = function (questions) {
//   console.log(questions)
//   var deferred = Promise.pending()
//   inquirer.prompt(questions)
//   return deferred.promise
// }

var delay = function (ms) {
  var deferred = Promise.pending()
  setTimeout(function () {
    deferred.resolve()
  }, ms)
  return deferred.promise
}

var shopify = {
  isRunning: false,
  throttle: 0,
  inFlight: 0,
  rate: 0,
  max: 40,
  queue: []
}

shopify.add = function (item) {
  shopify.queue.push(item)
  if (!shopify.isRunning) {
    shopify.run()
  }
}

shopify.retry = function (item) {
  shopify.queue.unshift(item)
  if (!shopify.isRunning) {
    shopify.run()
  }
}

shopify.run = function () {
  return co(function *() {
    shopify.isRunning = true
    while (shopify.queue.length > 0) {
      let headroom = shopify.max - (shopify.rate + shopify.inFlight)
      if (headroom <= 0) { headroom = 0 }
      let exponent = ((headroom * headroom) / 9)
      if (exponent <= 0) { exponent = 1 }

      shopify.throttle = 500 / exponent

      yield delay(shopify.throttle)
      shopify.request(shopify.queue.shift())
    }
    shopify.isRunning = false
  })
}

shopify.request = function (item) {
  return co(function *() {
    shopify.inFlight += 1
    var res = yield axios(item.request)
    shopify.inFlight -= 1
    let body = res.data
    if (body.errors) {
      item.deferred.reject(body.errors)
    } else {
      let limit = res.headers['x-shopify-shop-api-call-limit']
      limit = limit.split('/')
      shopify.rate = parseInt(_.first(limit), 10)
      shopify.max = parseInt(_.last(limit), 10)

      item.deferred.resolve(res)
    }
  }).catch(function (res) {
    if (_.includes([429], res.status)) {
      shopify.retry(item)
    } else if (_.includes([422], res.status)) {
      let body = res.data
      if (_.isArray(body.errors.asset)) {
        for (let error of body.errors.asset) {
          console.log(colors.red(`Error in ${item.req.filepath} - ${error}`))
        }
      }
      item.deferred.reject(body.errors)
    } else {
      item.deferred.reject(res)
    }
  })
}

var loadConfig = function () {
  return co(function *() {
    let data

    try {
      data = yield fs.readFileAsync(path.join(process.cwd(), 'quickshot.json'), 'utf8')
    } catch (err) {
      throw new Error('Shop configuration is missing, have you run \'quickshot configure\'?')
    }

    try {
      data = JSON.parse(data)
    } catch (err) {
      throw new Error('Shop configuration is corrupt, you may need to delete \'quickshot.json\', and run \'quickshot configure\' again.')
    }

    if (!data.configVersion || data.configVersion < CONFIGVERSION) {
      throw new Error('Shop configuration is from an older incompatible version of quickshot. You need to run \'quickshot configure\' again.')
    }

    return data
  })
}

var shopifyRequest = function (req) {
  req.deferred = Promise.pending()
  shopify.add(req)
  return req.deferred.promise
}

var getTarget = function (config, argv) {
  return co(function *() {
    if (argv['target']) {
      var targetName = argv['target']
    }

    var target = null
    if (_.isArray(config.targets)) {
      if (targetName) {
        target = _.find(config.targets, {target_name: targetName})
        if (!target) {
          throw new Error(`Could not find target '${targetName}'`)
        }
      } else {
        var targetChoices = _.map(config.targets, (target) => { return `[${target.target_name}] - '${target.theme_name}' at ${target.domain}.myshopify.com` })
        if (config.targets.length > 1) {
          let choice = yield inquirer.prompt([
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

    target.auth = 'Basic ' + new Buffer(`${target.api_key}:${target.password}`).toString('base64')
    return target
  }).catch((err) => {
    throw err
  })
}

var getShopPages = function *(target) {
  var chunkSize = 250
  var page = 1
  var pages = []
  var pagesBody = {
    pages: [0]
  }

  while (pagesBody.pages.length !== 0) {
    let pagesBody = yield this.shopifyRequest({
      method: 'get',
      url: `https://${target.api_key}:${target.password}this.${target.domain}.myshopify.com/admin/pages.json?limit=${chunkSize}&page=${page}`
    })

    pages = pages.concat(pagesBody.pages)
    page += 1
  }

  return pages
}

var ts = function () {
  return moment().format('hh:mm:ss a')
}

var log = function (text, color = 'white') {
  console.log(colors[color](`${ts()} - ${text}`))
}

var listFiles = function (dirPath = '') {
  return co(function *() {
    var files = []

    yield Promise.fromCallback(function (cb) {
      dive(path.join(process.cwd(), dirPath), { all: true }, function (err, file) {
        if (err) { throw err }
        if (file.match(/[\(\)]/)) {
          throw new Error(`Filename may not contain parentheses, please rename - "${file}"`)
        }
        files.push(file)
      }, cb)
    })

    console.log(files)
    return files
  }).catch((err) => {
    throw err
  })
}

module.exports = {
  loadConfig: loadConfig,
  getTarget: getTarget,
  listFiles: listFiles
}
