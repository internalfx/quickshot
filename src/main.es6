
import colors from 'colors'
import co from 'co'
import _ from 'lodash'
import { log } from './helpers'
import Configure from './configure'
import Blogs from './blogs'
import Pages from './pages'
import Products from './products'
import Theme from './theme'

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
  co(function *() {
    var command = _.first(argv['_'])
    argv['_'] = argv['_'].slice(1)

    var result = null

    if (command === 'configure') {
      result = yield Configure.run(argv)
    } else if (command === 'blogs') {
      result = yield Blogs(argv)
    } else if (command === 'pages') {
      result = yield Pages.run(argv)
    } else if (command === 'products') {
      result = yield Products.run(argv)
    } else if (command === 'theme') {
      result = yield Theme(argv)
    } else {
      console.log(HELPTEXT)
    }

    log(result, 'green')
  }).catch(function (err) {
    log(err, 'red')
  })
}

export default run

// var run = function (argv) {
//   command = _.first(argv['_'])
//   argv['_'] = argv['_'].slice(1)
//   switch command
//     when "configure"
//       await require('./configure').run(argv, defer(err))
//     when "blogs"
//       await require('./blogs')(argv, defer(err))
//     when "pages"
//       await require('./pages').run(argv, defer(err))
//     when "products"
//       await require('./products').run(argv, defer(err))
//     when "theme"
//       await require('./theme').run(argv, defer(err))
//     else
//       console.log HELPTEXT
//
//   if err?
//     console.log colors.red(err)
//
//   process.exit()
