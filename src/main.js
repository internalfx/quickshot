
let path = require('path')
let requireAll = require('require-all')

/* global VERSION */

var HELPTEXT = `

    Quickshot ${VERSION}
    ==============================

    Commands:
      quickshot config                        Creates/Updates the configuration file in current directory
      quickshot theme                         Manage Shopify themes
      quickshot                               Show this screen.

`

module.exports = async function (argv) {
  let command = argv['_'].shift()

  let commands = requireAll({
    dirname: path.join(__dirname, 'commands')
  })

  if (commands[command] == null) {
    console.log(HELPTEXT)
  } else {
    return commands[command](argv)
  }
}
