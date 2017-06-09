
let _ = require('lodash')
let Download = require('./collections/download')
let Upload = require('./collections/upload')

/* global VERSION */

let HELPTEXT = `

    Quickshot collections ${VERSION}
    ==============================

    Commands:
      quickshot collections upload [options]           Upload collections
      quickshot collections download [options]         Download collections
      quickshot collections                            Show this screen.

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
