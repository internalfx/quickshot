
let Promise = require('bluebird')
let rp = require('request-promise')
let _ = require('lodash')
let { log } = require('./helpers')
let context = require('./context')

let queues = {}

let createQueue = function () {
  let isProcessing = false
  let inFlight = 0
  let rate = 0
  let max = 40
  let list = []

  let add = async function (target, request) {
    return new Promise((resolve, reject) => {
      list.push({ target, request, resolve, reject })
      if (!isProcessing) {
        process()
      }
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
    try {
      result = await rp({
        ...request,
        url: `${url(target)}${request.url}`,
        resolveWithFullResponse: true,
        gzip: true,
        json: true
      })
    } catch (err) {
      if (err.statusText === 'Too Many Requests') {
        log(`Exceeded Shopify API limit, will retry...`, 'yellow')
        return list.unshift({ target, request, resolve, reject })
      } else {
        let errorMsg
        if (err.message) {
          errorMsg = err.message
          if (_.isObject(errorMsg)) {
            errorMsg = JSON.stringify(errorMsg)
          }
        } else {
          errorMsg = `Request Failed!: [${err.status}] ${err.statusText}`
        }
        return reject({ message: errorMsg, data: err.error })
      }
    }
    inFlight -= 1

    // console.log(_.pick(result, 'body', 'headers'))

    if (result.body.errors) {
      return reject(result.body.errors)
    } else {
      let limit = result.headers['x-shopify-shop-api-call-limit']
      limit = limit.split('/')
      rate = parseInt(limit[0], 10)
      max = parseInt(limit[1], 10)
    }

    return resolve(result.body)
  }

  return {
    add
  }
}

let run = function (target, request) {
  // console.log(target)
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
