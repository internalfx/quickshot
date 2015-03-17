
helpers = require('./helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
mfs = require('machinepack-fs')
request = require('request')

exports.run = (argv, done) ->

  await helpers.loadConfig(defer(err, currConfig, projDir))

  await inquirer.prompt([
    {
      type: 'input'
      name: 'api_key'
      message: "Shopify Private APP API key?"
      default: currConfig?.api_key || null
    }
    {
      type: 'input'
      name: 'password'
      message: "Shopify Private APP Password?"
      default: currConfig?.password || null
    }
    {
      type: 'input'
      name: 'domain'
      message: "Store URL?"
      default: currConfig?.domain || null
    }
  ], defer(config))

  domain = config.domain
  domain = domain.replace(new RegExp('^https?://'), '')
  domain = domain.replace(new RegExp('\.myshopify\.com.*'), '')
  config.domain = domain

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
      default: _.find(themes, {id: currConfig?.theme_id})?.name || null
      choices: _.map(themes, (theme) -> theme.name)
    }
    {
      type: 'confirm'
      name: 'compile_sass'
      message: "Would you like to enable automatic compiling for scss files?"
      default: currConfig?.compile_sass || false
    }
  ], defer(choices))

  theme = _.find(themes, {name: choices.theme})
  config.theme_id = theme.id
  config.compile_sass = choices.compile_sass

  scss_warning = """
    You have enabled scss compiling.\n
    The filename you enter below will be recompiled anytime ANY scss file changes while using 'quickshot watch'.
    You will want to put all your @import calls in that file. Then in your theme.liquid you will only need to include the compiled css file.
    See docs at https://github.com/internalfx/quickshot for more information.
  """

  if config.compile_sass
    console.log colors.yellow(scss_warning)
    await inquirer.prompt([
      {
        type: 'input'
        name: 'primary_scss_file'
        message: "Enter relative path to primary scss file."
        default: currConfig?.primary_scss_file || 'assets/application.scss'
        choices: _.map(themes, (theme) -> theme.name)
      }
    ], defer(choices))
    config.primary_scss_file = choices.primary_scss_file

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
