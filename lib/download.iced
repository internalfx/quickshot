
helpers = require('./helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')

HELPTEXT = """

              Quickshot Download
              ==============================

              Usage:
                quickshot download [filter]      Download theme files, optionally only files/folders specified in the filter

            """

exports.run = (argv, done) ->
  filter = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)

  await helpers.loadConfig(defer(err, config))

  await request({
    method: 'get'
    url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes/#{config.theme_id}/assets.json"
  }, defer(err, res, assetsBody))
  if err? then done(err)

  assets = JSON.parse(assetsBody).assets
  await
    for asset in assets
      ((cb, asset)->

        await helpers.shopifyRequest({
          method: 'get'
          url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes/#{config.theme_id}/assets.json"
          qs: {
            asset: {key: asset.key}
          }
        }, defer(err, data))

        console.log colors.green("Downloaded #{asset.key}")
        if data.asset.attachment
          rawData = new Buffer(data.asset.attachment, 'base64')
        else if data.asset.value
          rawData = new Buffer(data.asset.value, 'utf8')

        await mkdirp(path.dirname(data.asset.key), defer(err))
        await fs.writeFile(data.asset.key, rawData, defer(err))
        if err? then cb(err)
      )(defer(err), asset)


  console.log HELPTEXT

  done()
