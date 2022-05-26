
import _ from 'lodash'
import Promise from 'bluebird'
import rp from 'request-promise'
import { log, to } from './helpers.js'
import context from './context.js'

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
      timeout: 30000,
    }))

    inFlight -= 1

    if (result.isError) {
      if (result.statusCode === 429) {
        await log(`Exceeded Shopify API limit, will retry...`, `yellow`)
        list.unshift({ target, spec, resolve, reject })
        if (!isProcessing) { process() }
        return
      } else if (result.statusCode === 404) {
        if (_.get(spec, `body.asset.key`)) {
          return reject({
            message: `404 Not Found - Are you sure "${_.get(spec, `body.asset.key`)}" is a valid Shopify theme path?`,
            data: _.get(spec, `body`),
          })
        } else {
          return reject({
            message: `404 Not Found - Are you sure "${result.options.url}" is a valid resource?`,
            data: { body: _.get(spec, `body`), url: result.options.url },
          })
        }
      } else if (result.error && [`ETIMEDOUT`, `ESOCKETTIMEDOUT`].includes(result.error.code)) {
        await log(`Connection timed out, will retry...`, `yellow`)
        list.unshift({ target, spec, resolve, reject })
        if (!isProcessing) { process() }
        return
      } else if (result.error && result.error.code === `EAI_AGAIN`) {
        await log(`Failed to resolve host, will retry...`, `yellow`)
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
        await log(`Request Error [${spec.url}]`, `red`)
        return reject({ message: errorMsg, data: result.error })
      }
    } else {
      if (result.body.errors) {
        await log(`Request Error [${spec.url}]`, `red`)
        return reject(result.body.errors)
      } else {
        let limit = result.headers[`x-shopify-shop-api-call-limit`]
        limit = limit.split(`/`)
        rate = parseInt(limit[0], 10)
        max = parseInt(limit[1], 10)
      }
    }

    const linkList = result.headers.link ? result.headers.link.split(`,`) : []

    for (const link of linkList) {
      if (link.match(/rel="next"/)) {
        result.linkNext = new URL(link.replace(/<(.*)>.*/, `$1`))
      } else if (link.match(/rel="previous"/)) {
        result.linkPrev = new URL(link.replace(/<(.*)>.*/, `$1`))
      }
    }

    return resolve(result)
  }

  return {
    add,
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

export default run
