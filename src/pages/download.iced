
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

  await helpers.getTarget(config, argv, defer(err, target))
  if err? then return done(err)

  await helpers.getShopPages(target, defer(err, pages))
  if err? then return cb(err)

  for page in pages
    key = "pages/#{page.handle}.html"

    if not filter? or key.match(new RegExp("^#{filter}"))
      await mkdirp(path.dirname(key), defer(err))
      await fs.writeFile(key, page.body_html, defer(err))
      helpers.log("Downloaded #{key}", 'green')

  done()
