
const Promise = require('bluebird')
const rp = require('request-promise')
const _ = require('lodash')
const { log, to } = require('./helpers')
const context = require('./context')

const queues = {}

const createQueue = function () {
  let isProcessing = false
  let inFlight = 0
  let rate = 0
  let max = 5
  const list = []

  const add = async function (target, spec) {
    return new Promise((resolve, reject) => {
      list.push({ target, spec, resolve, reject })
      if (!isProcessing) { process() }
    })
  }

  const process = async function () {
    isProcessing = true
    while (list.length > 0) {
      const req = list.shift()
      let headroom = max - (rate + inFlight)
      if (headroom <= 0) { headroom = 0 }
      let exponent = (headroom * headroom)
      if (exponent <= 0.9) { exponent = 0.9 }
      const throttle = 500 / exponent

      await Promise.delay(throttle)
      request(req)
    }
    isProcessing = false
  }

  const request = async function ({ target, spec, resolve, reject }) {
    inFlight += 1

    const result = await to(rp({
      ...spec,
      url: `${url(target)}${spec.url}`,
      resolveWithFullResponse: true,
      gzip: true,
      json: true,
      timeout: 5000
    }))

    inFlight -= 1

    if (result.isError) {
      if (result.statusCode === 429) {
        log('Exceeded Shopify API limit, will retry...', 'yellow')
        list.unshift({ target, spec, resolve, reject })
        if (!isProcessing) { process() }
        return
      } else if (result.statusCode === 404) {
        return reject({
          message: `404 Not Found - Are you sure "${_.get(spec, 'body.asset.key')}" is a valid Shopify theme path?`,
          data: _.get(spec, 'body')
        })
      } else if (result.error && ['ETIMEDOUT', 'ESOCKETTIMEDOUT'].includes(result.error.code)) {
        log('Connection timed out, will retry...', 'yellow')
        list.unshift({ target, spec, resolve, reject })
        if (!isProcessing) { process() }
        return
      } else if (result.error && result.error.code === 'EAI_AGAIN') {
        log('Failed to resolve host, will retry...', 'yellow')
        list.unshift({ target, spec, resolve, reject })
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

const run = function (target, spec) {
  let queue
  if (queues[target.domain]) {
    queue = queues[target.domain]
  } else {
    queue = createQueue()
    queues[target.domain] = queue
  }

  return queue.add(target, spec)
}

const url = function (target) {
  return `${target.url}/${context.apiVersion}`
}

module.exports = run
