
helpers = require('./helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
mfs = require('machinepack-fs')
request = require('request')

exports.run = (argv, done) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)

  await inquirer.prompt([
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

  console.log colors.green("\nShop credentials set! Fetching themes...\n")
  await request({
    method: 'get'
    url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes.json"
  }, defer(err, res, body))
  if err? then done(err)

  themes = JSON.parse(body).themes

  await inquirer.prompt([
    {
      type: 'list'
      name: 'theme'
      message: "Select theme"
      default: null
      choices: _.map(themes, (theme) -> theme.name)
    }
  ], defer(themeSelection))

  theme = _.find(themes, {name: themeSelection.theme})
  config.theme_id = theme.id

  mfs.writeJson(
    json: config
    destination: "quickshot.json"
    force: true
  ).exec(
    error: (err) ->
      console.log colors.red(err)
      return done()
    success: ->
      console.log colors.green("\nConfiguration saved!\n")
      return done()
  )
