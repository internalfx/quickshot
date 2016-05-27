
let _ = require('lodash')
let Download = require('./pages/download')
let Upload = require('./pages/upload')

/* global VERSION */

HELPTEXT = `

    Quickshot pages ${VERSION}
    ==============================

    Commands:
      quickshot pages upload [options] [filter]     Upload pages files, optionally providing a filter
      quickshot pages download [options] [filter]   Download pages files, optionally providing a filter
      quickshot pages watch [options]               Watch pages folder and synchronize changes automatically
      quickshot pages                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download/watch

`

let run = function *(argv) {
  var command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)

  var result = null

  if (command === 'download') {
    result = yield Download(argv)
  } else if (command === 'upload') {
    result = yield Upload(argv)
  } else if (command === 'watch') {
    // result = yield Watch(argv)
  } else {
    console.log(HELPTEXT)
  }

  return result
}

module.exports = run
