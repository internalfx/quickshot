
_ = require('lodash')
inquirer = require("inquirer")
colors = require('colors')
config = require('config')
fs = require('fs')

HELPTEXT = """

              Quickshot Config
              ==============================
              Create a new shopify theme project, and configures shopify sync.

              Usage:
                quickshot config new              Create new project.
                quickshot config --help           Show this screen.

            """

exports.run = (argv, done) ->

  if argv.help
    console.log HELPTEXT
    return done()

  await
    inquirer.prompt([
      {
        type: 'input'
        name: 'api_key'
        message: "Shopify Private APP API key?"
        default: null
      }
      {
        type: 'input'
        name: 'password'
        message: "Shopify Private APP Password?"
        default: null
      }
      {
        type: 'input'
        name: 'domain'
        message: "Shopify Domain? If your store is at 'https://your-domain.myshopify.com/' enter 'your-domain'."
        default: null
      }
    ], defer(answers))

  console.log answers

  await fs.writeFile('./config.json', JSON.stringify(answers), defer(err))

  return done()
