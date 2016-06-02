
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
coffee = require('coffee-script')
babel = require('babel-core')

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
    cwd: path.join(process.cwd(), 'theme')
  })

  watcher.on('all', (event, filepath) ->
    extension = path.extname(filepath).substr(1)

    # filepath = path.join('theme', filepath)

    # Ignore hidden files
    if filepath.match(/^\..*$/) then return

    # Ignore paths configured in ignore file
    if config.ignore_file
      if ignore.denies(filepath) then return

    switch event
      when 'add', 'change'

        if filepath.match(/[\(\)]/)
          return helpers.log("Filename may not contain parentheses, please rename - \"#{filepath}\"", 'red')

        if config.compile_scss and filepath.match(/\.scss$/)
          mainscss = config.primary_scss_file
          targetscss = mainscss.replace('.scss', '.css.liquid')
          helpers.log("Compiling Sass: \"#{mainscss}\" -> \"#{targetscss}\"", 'yellow')
          await sass.render({file: path.join('theme', mainscss), outFile: path.join('theme', targetscss)}, defer(err, result))
          if err? then done(err)
          await fs.writeFile(path.join('theme', targetscss), result.css, defer(err))
          if err? then done(err)

        if config.compile_coffeescript and filepath.match(/\.coffee$/)
          sourceCoffee = path.join('theme', filepath)
          helpers.log("Compiling CoffeeScript: \"#{filepath}\"", 'yellow')
          await fs.readFile(sourceCoffee, 'utf8', defer(err, source))
          if err? then done(err)
          compiledSource = coffee.compile(source)
          await fs.writeFile(sourceCoffee.replace('.coffee', '.js'), compiledSource, defer(err))
          if err? then done(err)

        if config.compile_babel and filepath.match(/\.(jsx|es6)$/)
          sourceBabel = path.join('theme', filepath)
          helpers.log("Compiling Babel: \"#{filepath}\"", 'yellow')
          await fs.readFile(sourceBabel, 'utf8', defer(err, source))
          if err? then return helpers.log(err, 'red')
          try
            compiledSource = babel.transform(source, {modules: 'umd'})
          catch err
            helpers.log(err, 'red')
          if (compiledSource)
            await fs.writeFile(sourceBabel.replace(/\.(jsx|es6)$/, '.js'), compiledSource.code, defer(err))
            if err? then return helpers.log(err, 'red')

        await fs.readFile(path.join('theme', filepath), defer(err, data))
        if err? then helpers.log(err, 'red')
        await helpers.shopifyRequest({
          filepath: filepath.split(path.sep).join('/')
          method: 'put'
          url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/themes/#{target.theme_id}/assets.json"
          json: {
            asset: {
              key: filepath.split(path.sep).join('/')
              attachment: data.toString('base64')
            }
          }
        }, defer(err, res, assetsBody))
        if err? then helpers.log(err, 'red')

        unless err? then helpers.log("Added/Updated #{filepath}", 'green')

      when 'unlink'
        await helpers.shopifyRequest({
          method: 'delete'
          url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/themes/#{target.theme_id}/assets.json"
          qs: {
            asset: {key: filepath.split(path.sep).join('/')}
          }
        }, defer(err, res, assetsBody))
        if err? then helpers.log(err, 'red')

        helpers.log("Deleted #{filepath}", 'green')
  )

  helpers.log "Watching Theme..."
