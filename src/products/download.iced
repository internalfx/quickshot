
helpers = require('../helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')
parser = require('gitignore-parser')

exports.run = (argv, done) ->
  filter = _.first(argv['_'])

  await helpers.loadConfig(defer(err, config))
  if err? then return done(err)

  if config.ignore_file
    ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'))

  await helpers.getTarget(config, argv, defer(err, target))
  if err? then return done(err)

  await helpers.getShopProducts(target, defer(err, products))
  if err? then return cb(err)

  for product in products
    key = "products/#{product.handle}.json"

    await mkdirp(path.dirname(key), defer(err))
    await fs.writeFile(key, JSON.stringify(product), defer(err))
    console.log colors.green("Downloaded #{key}")

  done()
