
// let _ = require('lodash')
const path = require(`path`)
const requireAll = require(`require-all`)

/* global VERSION */

var HELPTEXT = `

    Quickshot theme ${VERSION}
    ==============================

    Commands:
      quickshot theme upload [options]              Upload theme files
      quickshot theme download [options]            Download theme files
      quickshot theme watch [options]               Watch theme folder, compile and synchronize changes automatically
      quickshot theme                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download/watch
      --filter=[filter]                             Filter files for upload/download
      --sync                                        Enable experimental two-way sync for watch

`

module.exports = async function (argv) {
  const command = argv._.shift()

  const commands = requireAll({
    dirname: path.join(__dirname, `theme`)
  })

  if (commands[command] == null) {
    console.log(HELPTEXT)
  } else {
    return commands[command](argv)
  }
}
