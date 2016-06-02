
let co = require('co')
let _ = require('lodash')
let { log } = require('./helpers')
let Configure = require('./configure')
let Blogs = require('./blogs')
let Pages = require('./pages')
let Products = require('./products')
let Theme = require('./theme')

/* global VERSION */

var HELPTEXT = `

    Quickshot ${VERSION}
    ==============================

    Commands:
      quickshot configure                     Creates/Updates the configuration file in current directory
      quickshot blogs                         Manage Shopify blogs
      quickshot pages                         Manage Shopify pages
      quickshot products                      Manage Shopify products
      quickshot theme                         Manage Shopify themes
      quickshot                               Show this screen.

`

var run = function (argv) {
  return co(function *() {
    var command = _.first(argv['_'])
    argv['_'] = argv['_'].slice(1)

    var result

    if (command === 'configure') {
      result = yield Configure(argv)
    } else if (command === 'blogs') {
      result = yield Blogs(argv)
    } else if (command === 'pages') {
      result = yield Pages(argv)
    } else if (command === 'products') {
      result = yield Products(argv)
    } else if (command === 'theme') {
      result = yield Theme(argv)
    } else {
      console.log(HELPTEXT)
    }

    if (result) {
      log(result, 'green')
    }
  }).catch(function (err) {
    log(err.stack, 'red')
  })
}

module.exports = run
