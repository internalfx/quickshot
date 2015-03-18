
helpers = require('./helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')

exports.run = (argv, done) ->
  filter = _.first(argv['_'])

  await helpers.loadConfig(defer(err, config))
  if err? then done(err)

  await helpers.shopifyRequest({
    method: 'get'
    url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes/#{config.theme_id}/assets.json"
  }, defer(err, res, assetsBody))
  if err? then done(err)

  assets = assetsBody.assets
  await
    for asset in assets
      if not filter? or asset.key.match(new RegExp("^#{filter}"))
        ((cb, asset)->

          await helpers.shopifyRequest({
            method: 'get'
            url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes/#{config.theme_id}/assets.json"
            qs: {
              asset: {key: asset.key}
            }
          }, defer(err, res, data))

          console.log colors.green("Downloaded #{asset.key}")
          if data.asset.attachment
            rawData = new Buffer(data.asset.attachment, 'base64')
          else if data.asset.value
            rawData = new Buffer(data.asset.value, 'utf8')

          await mkdirp(path.dirname(data.asset.key), defer(err))
          await fs.writeFile(data.asset.key, rawData, defer(err))
          if err? then cb(err)

        )(defer(err), asset)

  done()
