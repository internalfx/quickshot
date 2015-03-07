
_ = require('lodash')
inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
helpers = require('./helpers')
mfs = require('machinepack-fs')

HELPTEXT = """

              Quickshot New
              ==============================
              Create a new shopify theme project, and configures shopify sync.

              Usage:
                quickshot new shop              Connect to shop and create project directory

            """

exports.run = (argv, done) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)

  switch command
    when "shop"
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

      await
        cb = defer()
        mfs.mkdir(
          destination: "./#{config.domain}"
        ).exec(
          error: done
          success: ->
            cb()
        )

      mfs.writeJson(
        json: config
        destination: "./#{config.domain}/quickshot.json"
      ).exec(
        error: (err) ->
          console.log colors.red(err)
          return done()
        success: ->
          console.log colors.green("Configuration saved!")
          return done()
      )

    else
      console.log HELPTEXT
      return done()
