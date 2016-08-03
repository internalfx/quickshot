
let _ = require('lodash')
let { loadConfig, getTarget, log } = require('../helpers')
let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
let path = require('path')
let asyncEach = require('../asyncEach')
let requestify = require('../requestify')

module.exports = function *(argv) {
  let config = yield loadConfig()
  let total = 0

  let target = yield getTarget(config, argv)

  let pageDirs = fs.readdirSync(path.join(process.cwd(), 'pages')).filter(function (file) {
    return fs.statSync(path.join(process.cwd(), 'pages', file)).isDirectory()
  })

  yield asyncEach(pageDirs, function *(pageDir) {
    let pagePath = path.join(process.cwd(), 'pages', pageDir)

    let pageJson = yield fs.readFileAsync(path.join(pagePath, 'page.json'), 'utf8')
    let pageData = _.omit(JSON.parse(pageJson), 'id')
    pageData.body_html = yield fs.readFileAsync(path.join(pagePath, 'page.html'), 'utf8')

    let newPage = yield requestify(target, {
      method: 'post',
      url: `/admin/pages.json`,
      data: { page: pageData }
    })

    newPage = newPage.page

    let metaJson = yield fs.readFileAsync(path.join(pagePath, 'metafields.json'), 'utf8')
    let metafields = JSON.parse(metaJson)

    yield asyncEach(metafields, function *(metafield) {
      yield requestify(target, {
        method: 'post',
        url: `/admin/pages/${newPage.id}/metafields.json`,
        data: { metafield: metafield }
      })
    }, {concurrency: config.concurrency})

    total += 1
  }, {concurrency: config.concurrency})

  return `Uploaded ${total} pages.`
}
