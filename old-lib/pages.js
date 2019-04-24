
let _ = require('lodash')
let Download = require('./pages/download')
let Upload = require('./pages/upload')

/* global VERSION */

let HELPTEXT = `

    Quickshot pages ${VERSION}
    ==============================

    Commands:
      quickshot pages upload [options]              Upload pages files
      quickshot pages download [options]            Download pages files
      quickshot pages                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download

`

module.exports = function *(argv) {
  var command = _.first(argv['_'])
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
