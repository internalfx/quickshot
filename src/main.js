
import _ from 'lodash'
import context from './context.js'

import blogs from './commands/blogs.js'
import config from './commands/config.js'
import pages from './commands/pages.js'
import products from './commands/products.js'
import theme from './commands/theme.js'
import { log, loadConfig } from './helpers.js'

const HELPTEXT = `

    Quickshot ${context.VERSION}
    ==============================

    Commands:
      quickshot config                        Creates/Updates the configuration file in current directory
      quickshot blogs                         Manage Shopify blogs
      quickshot pages                         Manage Shopify pages
      quickshot products                      Manage Shopify products
      quickshot theme                         Manage Shopify themes
      quickshot                               Show this screen.

`

export default async function (argv) {
  const command = argv._.shift()
  const fullCommand = _.compact([command, argv._[0]]).join(` `)

  try {
    await loadConfig()
  } catch (err) {
    if (command !== `config`) {
      throw err
    }
  }

  const commands = {
    blogs,
    config,
    pages,
    products,
    theme,
  }

  await log(`RUN COMMAND [${fullCommand}] ================================`)

  if (commands[command] == null) {
    console.log(HELPTEXT)
  } else {
    return commands[command](argv)
  }
}
