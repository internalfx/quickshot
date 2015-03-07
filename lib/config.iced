
_ = require('lodash')
inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
helpers = require('./helpers')

HELPTEXT = """

              Quickshot Config
              ==============================
              Create a new shopify theme project, and configures shopify sync.

              Usage:
                quickshot config edit             Create/edit config file
                quickshot congig show             Show current config
                quickshot config --help           Show this screen

            """

exports.run = (argv, done) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)

  switch command
    when "edit"
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
        ], defer(config))
      await helpers.saveConfig(config, defer(err))
      if err? then console.log colors.red(err)
      console.log "CONFIGURATION FILE WRITTEN"
      return done()
    when "show"
      await helpers.loadConfig(defer(err, config))
      if err? then console.log colors.red(err)
      console.log colors.cyan("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      console.log config
      console.log colors.cyan("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
      return done()
    else
      console.log HELPTEXT
      return done()
