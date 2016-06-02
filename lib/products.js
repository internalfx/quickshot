
let _ = require('lodash')
let Download = require('./products/download')
let Upload = require('./products/upload')

/* global VERSION */

let HELPTEXT = `

    Quickshot products ${VERSION}
    ==============================

    Commands:
      quickshot products upload [options]           Upload products
      quickshot products download [options]         Download products
      quickshot products                            Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download

`

module.exports = function *(argv) {
  let command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)

  var result = null

  if (command === 'download') {
    result = yield Download(argv)
  } else if (command === 'upload') {
    result = yield Upload(argv)
  } else {
    console.log(HELPTEXT)
  }

  return result
}
