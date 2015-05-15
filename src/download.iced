
helpers = require('./helpers')

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

  await helpers.getTarget(config, defer(err, target))
  if err? then return done(err)

  await

    # PAGES
    ((cb)->

      await helpers.getShopPages(target, defer(err, pages))
      if err? then return cb(err)

      for page in pages
        key = "pages/#{page.handle}.html"
        # Ignore paths configured in ignore file
        if ignore and ignore.denies(key)
          continue

        if not filter? or key.match(new RegExp("^#{filter}"))
          await mkdirp(path.dirname(key), defer(err))
          await fs.writeFile(key, page.body_html, defer(err))
          console.log colors.green("Downloaded #{key}")

      return cb(null)

    )(defer(err))

    # ASSETS
    ((cb)->

      await helpers.shopifyRequest({
        method: 'get'
        url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/themes/#{target.theme_id}/assets.json"
      }, defer(err, res, assetsBody))
      if err? then return cb(err)

      assets = assetsBody.assets
      await
        for asset in assets
          key = asset.key
          # Ignore paths configured in ignore file
          if ignore and ignore.denies(key)
            continue

          if not filter? or key.match(new RegExp("^#{filter}"))
            ((cb, asset, key)->

              await helpers.shopifyRequest({
                filepath: key
                method: 'get'
                url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/themes/#{target.theme_id}/assets.json"
                qs: {
                  asset: {key: key}
                }
              }, defer(err, res, data))
              if err?
                console.log colors.red(err)
                cb(err)

              console.log colors.green("Downloaded #{key}")
              if data.asset.attachment
                rawData = new Buffer(data.asset.attachment, 'base64')
              else if data.asset.value
                rawData = new Buffer(data.asset.value, 'utf8')

              await mkdirp(path.dirname(data.asset.key), defer(err))
              await fs.writeFile(data.asset.key, rawData, defer(err))
              if err?
                console.log colors.red(err)
                cb(err)

            )(defer(err), asset, key)

      if err? then return cb(err)

      return cb(null)

    )(defer(err))

  done()
