
helpers = require('../helpers')

chokidar = require('chokidar')
inquirer = require('inquirer')
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')
sass = require('node-sass')
parser = require('gitignore-parser')

exports.run = (argv, done) ->

  await helpers.loadConfig(defer(err, config))
  if err? then done(err)

  if config.ignore_file
    ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'))

  await helpers.getTarget(config, argv, defer(err, target))
  if err? then return done(err)

  await helpers.getShopPages(target, defer(err, pages))
  if err? then return done(err)

  watcher = chokidar.watch('./', {
    ignored: /[\/\\]\./
    persistent: true
    ignoreInitial: true
    usePolling: true
    interval: 250
    binaryInterval: 250
    cwd: path.join(process.cwd(), 'pages')
  })

  watcher.on('all', (event, filepath) ->
    extension = path.extname(filepath).substr(1)

    filepath = path.join('pages', filepath)

    # Ignore hidden files
    if filepath.match(/^\..*$/) then return

    # Ignore paths configured in ignore file
    if config.ignore_file
      if ignore.denies(filepath) then return

    switch event
      when 'add', 'change'

        if filepath.match(/[\(\)]/)
          return helpers.log("Filename may not contain parentheses, please rename - \"#{filepath}\"", 'red')

        fileHandle = path.basename(filepath, '.html')

        page = _.find(pages, {handle: fileHandle})

        unless page then return helpers.log("Page with handle #{fileHandle} was not found in shop for #{filepath}", 'red')

        await fs.readFile(filepath, defer(err, data))
        await helpers.shopifyRequest({
          filepath: filepath
          method: 'put'
          url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/pages/#{page.id}.json"
          json: {
            page: {
              id: page.id
              body_html: data.toString('utf8')
            }
          }
        }, defer(err, res, assetsBody))

        unless err? then helpers.log("Added/Updated #{filepath}", 'green')

      when 'unlink'
        await helpers.shopifyRequest({
          method: 'delete'
          url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/themes/#{target.theme_id}/assets.json"
          qs: {
            asset: {key: filepath}
          }
        }, defer(err, res, assetsBody))
        if err? then helpers.log(err, 'red')

        helpers.log("Deleted #{filepath}", 'green')
  )

  helpers.log "Watching Pages..."
