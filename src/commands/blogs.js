
// let _ = require('lodash')
const path = require(`path`)
const requireAll = require(`require-all`)

/* global VERSION */

var HELPTEXT = `

    Quickshot blogs ${VERSION}
    ==============================

    Commands:
      quickshot blogs upload [options]              Upload blogs
      quickshot blogs download [options]            Download blogs
      quickshot blogs                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download

`

module.exports = async function (argv) {
  const command = argv._.shift()

  const commands = requireAll({
    dirname: path.join(__dirname, `blogs`)
  })

  if (commands[command] == null) {
    console.log(HELPTEXT)
  } else {
    return commands[command](argv)
  }
}
