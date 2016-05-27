
/* global VERSION */

let co = require('co')
let colors = require('colors')
let _ = require('lodash')
let Download = require('./blogs/download')
let Upload = require('./blogs/upload')

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

var run = function (argv, done) {
  co(function *() {
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

    console.log(colors.green(result))
    done()
  }).catch(done)
}

module.exports = run
