
let Promise = require('bluebird')
let rp = require('request-promise')
let _ = require('lodash')
let { log, to } = require('./helpers')
let context = require('./context')

let queues = {}

let createQueue = function () {
  let isProcessing = false
  let inFlight = 0
  let rate = 0
  let max = 5
  let list = []

  let add = async function (target, request) {
    return new Promise((resolve, reject) => {
      list.push({ target, request, resolve, reject })
      if (!isProcessing) { process() }
    })
  }

  let process = async function () {
    isProcessing = true
    while (list.length > 0) {
      let req = list.shift()
      let headroom = max - (rate + inFlight)
      if (headroom <= 0) { headroom = 0 }
      let exponent = (headroom * headroom)
      if (exponent <= 0.9) { exponent = 0.9 }
      let throttle = 500 / exponent

      await Promise.delay(throttle)
      request(req)
    }
    isProcessing = false
  }

  let request = async function ({ target, request, resolve, reject }) {
    inFlight += 1
    let result

    result = await to(rp({
      ...request,
      url: `${url(target)}${request.url}`,
      resolveWithFullResponse: true,
      gzip: true,
      json: true
    }))

    inFlight -= 1

    if (result.isError) {
      if (result.statusCode === 429) {
        log(`Exceeded Shopify API limit, will retry...`, 'yellow')
        list.unshift({ target, request, resolve, reject })
        if (!isProcessing) { process() }
        return
      } else {
        let errorMsg
        if (result.message) {
          errorMsg = result.message
          if (_.isObject(errorMsg)) {
            errorMsg = JSON.stringify(errorMsg)
          }
        } else {
          errorMsg = `Request Failed!: [${result.status}] ${result.statusText}`
        }
        return reject({ message: errorMsg, data: result.error })
      }
    } else {
      if (result.body.errors) {
        return reject(result.body.errors)
      } else {
        let limit = result.headers['x-shopify-shop-api-call-limit']
        limit = limit.split('/')
        rate = parseInt(limit[0], 10)
        max = parseInt(limit[1], 10)
      }
    }

    return resolve(result.body)
  }

  return {
    add
  }
}

let run = function (target, request) {
  let queue
  if (queues[target.domain]) {
    queue = queues[target.domain]
  } else {
    queue = createQueue()
    queues[target.domain] = queue
  }

  return queue.add(target, request)
}

let url = function (target) {
  return `${target.url}/${context.apiVersion}`
}

module.exports = run
