
helpers = require('./helpers')

chokidar = require('chokidar')
inquirer = require('inquirer')
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')
sass = require('node-sass')

exports.run = (argv, done) ->

  await helpers.loadConfig(defer(err, config, projDir))

  watcher = chokidar.watch('./', {
    ignored: /[\/\\]\./
    persistent: true
    ignoreInitial: true
    usePolling: true
    interval: 250
    binaryInterval: 250
    cwd: projDir
  })

  watcher.on('all', (event, filepath) ->
    extension = path.extname(filepath).substr(1)

    switch event
      when 'add', 'change'

        if filepath.match(/[\(\)]/)
          return console.log colors.red("Filename may not contain parentheses, please rename - \"#{filepath}\"")

        if filepath.match(/\.scss$/)
          targetpath = filepath.replace('.scss', '.css')
          console.log colors.yellow("Compiling Sass: \"#{filepath}\" -> \"#{targetpath}\"")
          await sass.render({file: filepath, outFile: targetpath}, defer(err, result))
          await fs.writeFile(targetpath, result.css, defer(err))

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

  console.log "Watching Files..."
