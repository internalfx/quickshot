
helpers = require('./helpers')

chokidar = require('chokidar')
inquirer = require('inquirer')
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')

exports.run = (argv, done) ->

  await helpers.loadConfig(defer(err, config, projDir))

  watcher = chokidar.watch('.', {
    ignored: /[\/\\]\./
    persistent: true
    ignoreInitial: true
    usePolling: true
    interval: 500
    binaryInterval: 500
    cwd: projDir
  })

  watcher.on('all', (event, filepath) ->
    # console.log event, filepath
    extension = path.extname(filepath).substr(1)

    switch event
      when 'add', 'change'

        if _.includes(['gif', 'png', 'jpg', 'mp4', 'm4v'], extension)
          isBinary = true
        else
          isBinary = false

        if filepath.match(/[\(\)]/)
          return console.log colors.red("Filename may not contain parentheses, please rename - \"#{filepath}\"")

        if isBinary
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

        console.log colors.green("Added/Updated #{filepath}")
      when 'unlink'
        await helpers.shopifyRequest({
          method: 'delete'
          url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes/#{config.theme_id}/assets.json"
          qs: {
            asset: {key: filepath}
          }
        }, defer(err, res, assetsBody))
        if err? then done(err)

        console.log colors.green("Deleted #{filepath}")

  )

  # done()
