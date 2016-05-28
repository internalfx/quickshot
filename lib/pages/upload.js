
let _ = require('lodash')
let helpers = require('../helpers')
let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
let path = require('path')
let asyncEach = require('co-each')
let requestify = require('../requestify')

var Upload = function *(argv) {
  var config = yield helpers.loadConfig()
  var totalArticles = 0

  var target = yield helpers.getTarget(config, argv)

  var pageDirs = fs.readdirSync(path.join(process.cwd(), 'pages')).filter(function (file) {
    return fs.statSync(path.join(process.cwd(), 'pages', file)).isDirectory()
  })

  yield asyncEach(pageDirs, function *(pageDir) {
    var pagePath = path.join(process.cwd(), 'pages', pageDir)

    var pageJson = yield fs.readFileAsync(path.join(pagePath, 'page.json'), 'utf8')
    var pageData = _.omit(JSON.parse(pageJson), 'id', 'blog_id')
    pageData.body_html = yield fs.readFileAsync(path.join(pagePath, 'page.html'), 'utf8')

    var newPage = yield requestify(target, {
      method: 'post',
      url: `/admin/pages.json`,
      data: { page: pageData }
    })

    newPage = newPage.page

    var metaJson = yield fs.readFileAsync(path.join(pagePath, 'metafields.json'), 'utf8')
    var metafields = JSON.parse(metaJson)

    yield asyncEach(metafields, function *(metafield) {
      yield requestify(target, {
        method: 'post',
        url: `/admin/pages/${newPage.id}/metafields.json`,
        data: { metafield: metafield }
      })
    })

    totalArticles += 1
  })

  return `Uploaded ${pageDirs.length} pages.`
}

module.exports = Upload
