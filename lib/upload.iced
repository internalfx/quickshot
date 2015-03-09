
helpers = require('./helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')
walk = require('walk')

exports.run = (argv, done) ->
  filter = _.first(argv['_'])

  await helpers.loadConfig(defer(err, config, projDir))

  walker = walk.walk(projDir, { followLinks: false })

  walker.on("file", (root, fileStat, next) ->
    filepath = path.join(root, fileStat.name).replace(projDir+"/", "")

    if filepath.match(new RegExp('^quickshot.json$')) then return next()

    if filter? and not filepath.match(new RegExp("^#{filter}")) then return next()

    extension = path.extname(filepath).substr(1)

    next()

    if filepath.match(/[\(\)]/)
      return console.log colors.red("Filename may not contain parentheses, please rename - \"#{filepath}\"")

    if helpers.isBinary(extension)
      await fs.readFile(filepath, defer(err, data))
      await helpers.shopifyRequest({
        method: 'put'
        url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes/#{config.theme_id}/assets.json"
        json: {
          asset: {
            key: filepath
            attachment: data.toString('base64')
          }
        }
      }, defer(err, res, assetsBody))
      if err? then done(err)
    else
      await fs.readFile(filepath, {encoding: 'utf8'}, defer(err, data))
      await helpers.shopifyRequest({
        method: 'put'
        url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes/#{config.theme_id}/assets.json"
        json: {
          asset: {
            key: filepath
            value: data
          }
        }
      }, defer(err, res, assetsBody))
      if err? then done(err)

    console.log colors.green("Uploaded #{filepath}")
  )
