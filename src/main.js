require(`@babel/register`)({
  cwd: __dirname,
  plugins: [`@babel/plugin-transform-modules-commonjs`],
  only: [
    `./*`
  ]
})

const path = require(`path`)
const requireAll = require(`require-all`)

/* global VERSION */

var HELPTEXT = `

    Quickshot ${VERSION}
    ==============================

    Commands:
      quickshot config                        Creates/Updates the configuration file in current directory
      quickshot blogs                         Manage Shopify blogs
      quickshot pages                         Manage Shopify pages
      quickshot products                      Manage Shopify products
      quickshot theme                         Manage Shopify themes
      quickshot                               Show this screen.

`

module.exports = async function (argv) {
  const command = argv._.shift()

  const commands = requireAll({
    dirname: path.join(__dirname, `commands`)
  })

  if (commands[command] == null) {
    console.log(HELPTEXT)
  } else {
    return commands[command](argv)
  }
}
