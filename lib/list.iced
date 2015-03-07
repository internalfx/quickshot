
helpers = require('./helpers')

_ = require('lodash')
inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
request = require('request')

HELPTEXT = """

              Quickshot List
              ==============================

              Usage:
                quickshot list themes         View available themes for the current shop

            """

exports.run = (argv, done) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)

  switch command
    when "themes"
      await helpers.loadConfig(defer(err, config))
      if err? then done(err)
      await request({
        method: 'get'
        url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes.json"
      }, defer(err, res, body))
      if err? then done(err)
      output = """

        Currently Installed Themes
        ==============================\n\n
        Theme name  |  Theme ID  |  Theme role  |  Date last updated
        ---------------------------------------------------------\n
      """
      themes = JSON.parse(body).themes
      if _.isArray(themes)
        for theme in themes
          output += """
            #{theme.name}  |  #{theme.id}  |  #{theme.role}  |  #{theme.updated_at}\n
          """
      output += "\n"
      console.log output

    else
      console.log HELPTEXT
      return done()
