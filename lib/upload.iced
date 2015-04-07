
helpers = require('./helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')
walk = require('walk')
parser = require('gitignore-parser')

exports.run = (argv, done) ->
  filter = _.first(argv['_'])

  await helpers.loadConfig(defer(err, config))
  if err? then done(err)

  if config.ignore_file
    ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'))

  await helpers.getTarget(config, defer(err, target))
  if err? then done(err)

  walker = walk.walk(process.cwd(), { followLinks: false })

  walker.on("file", (root, fileStat, next) ->
    filepath = path.join(root, fileStat.name).replace(process.cwd()+"/", "")

    # Ignore quickshot.json
    if filepath.match(/^quickshot.json$/) then return next()
    # Ignore hidden files
    if filepath.match(/^\..*$/) then return next()

    # Ignore paths configured in ignore file
    if config.ignore_file
      if ignore.denies(filepath) then return next()

    if filter? and not filepath.match(new RegExp("^#{filter}")) then return next()

    extension = path.extname(filepath).substr(1)

    next()

    if filepath.match(/[\(\)]/)
      return console.log colors.red("Filename may not contain parentheses, please rename - \"#{filepath}\"")

    await fs.readFile(filepath, defer(err, data))
    await helpers.shopifyRequest({
      filepath: filepath
      method: 'put'
      url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/themes/#{target.theme_id}/assets.json"
      json: {
        asset: {
          key: filepath
          attachment: data.toString('base64')
        }
      }
    }, defer(err, res, assetsBody))
    if err? then done(err)

    console.log colors.green("Uploaded #{filepath}")
  )
