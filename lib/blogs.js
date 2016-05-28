
let _ = require('lodash')
let Download = require('./blogs/download')
let Upload = require('./blogs/upload')

/* global VERSION */

var HELPTEXT = `

    Quickshot blogs ${VERSION}
    ==============================

    Commands:
      quickshot blogs upload [options]              Upload blogs files
      quickshot blogs download [options]            Download blogs files
      quickshot blogs                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download

`

module.exports = function *(argv) {
  var command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)

  var result

  if (command === 'download') {
    result = yield Download(argv)
  } else if (command === 'upload') {
    result = yield Upload(argv)
  } else {
    console.log(HELPTEXT)
  }

  return result
}
