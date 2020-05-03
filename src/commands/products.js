
// let _ = require('lodash')
const path = require(`path`)
const requireAll = require(`require-all`)

/* global VERSION */

var HELPTEXT = `

    Quickshot products ${VERSION}
    ==============================

    Commands:
      quickshot products upload [options]              Upload products
      quickshot products download [options]            Download products
      quickshot products                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download

`

module.exports = async function (argv) {
  const command = argv._.shift()

  const commands = requireAll({
    dirname: path.join(__dirname, `products`)
  })

  if (commands[command] == null) {
    console.log(HELPTEXT)
  } else {
    return commands[command](argv)
  }
}
