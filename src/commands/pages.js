
// let _ = require('lodash')
const path = require('path')
const requireAll = require('require-all')

/* global VERSION */

var HELPTEXT = `

    Quickshot pages ${VERSION}
    ==============================

    Commands:
      quickshot pages upload [options]              Upload pages
      quickshot pages download [options]            Download pages
      quickshot pages                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download
      --filter=[filter]                             Filter files for upload/download

`

module.exports = async function (argv) {
  const command = argv._.shift()

  const commands = requireAll({
    dirname: path.join(__dirname, 'pages')
  })

  if (commands[command] == null) {
    console.log(HELPTEXT)
  } else {
    return commands[command](argv)
  }
}
