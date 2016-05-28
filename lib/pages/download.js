
let helpers = require('../helpers')

let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
let _ = require('lodash')

// let inquirer = require('inquirer')
// let colors = require('colors')
let path = require('path')
// let request = require('request')
// let parser = require('gitignore-parser')
let asyncEach = require('co-each')
let requestify = require('../requestify')

module.exports = function *(argv) {
  let filter = _.first(argv['_'])
  let config = yield helpers.loadConfig()
  let total = 0
  let pageNum
  let target = yield helpers.getTarget(config, argv)

  pageNum = 1
  while (true) {
    let {pages} = yield requestify(target, {
      method: 'get',
      url: `/admin/pages.json?limit=250&page=${pageNum}`
    })
    pageNum += 1

    if (pages.length === 0) {
      break
    }

    yield asyncEach(pages, function *(page, idx) {
      let jsonKey = `pages/${page.handle}/page.json`
      let htmlKey = `pages/${page.handle}/page.html`

      yield fs.mkdirpAsync(path.dirname(jsonKey))

      let body_html = page.body_html
      delete page.body_html

      yield fs.writeFileAsync(jsonKey, JSON.stringify(page))
      yield fs.writeFileAsync(htmlKey, body_html)

      let {metafields} = yield requestify(target, {
        method: 'get',
        url: `/admin/pages/${page.id}/metafields.json`
      })

      yield fs.writeFileAsync(`pages/${page.handle}/metafields.json`, JSON.stringify(metafields))

      total += 1
    })
  }

  return `Downloaded ${total} pages.`
}
