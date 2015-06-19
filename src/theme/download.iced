
helpers = require('../helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')
parser = require('gitignore-parser')

target = null

downloader = (ctx, cb) ->

  await helpers.shopifyRequest({
    filepath: ctx.key
    method: 'get'
    url: "https://#{ctx.target.api_key}:#{ctx.target.password}@#{ctx.target.domain}.myshopify.com/admin/themes/#{ctx.target.theme_id}/assets.json"
    qs: {
      asset: {key: ctx.key}
    }
  }, defer(err, res, data))
  if err?
    console.log colors.red(err)
    cb(err)

  console.log colors.green("Downloaded #{ctx.key}")
  if data.asset.attachment
    rawData = new Buffer(data.asset.attachment, 'base64')
  else if data.asset.value
    rawData = new Buffer(data.asset.value, 'utf8')

  await mkdirp(path.join(process.cwd(), 'theme', path.dirname(data.asset.key)), defer(err))
  await fs.writeFile(path.join(process.cwd(), 'theme', data.asset.key), rawData, defer(err))
  if err?
    console.log colors.red(err)
    cb(err)

  cb()


exports.run = (argv, done) ->
  filter = _.first(argv['_'])

  await helpers.loadConfig(defer(err, config))
  if err? then return done(err)

  if config.ignore_file
    ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'))

  await helpers.getTarget(config, argv, defer(err, target))
  if err? then return done(err)

  await helpers.shopifyRequest({
    method: 'get'
    url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/themes/#{target.theme_id}/assets.json"
  }, defer(err, res, assetsBody))
  if err? then return done(err)

  assets = assetsBody.assets

  if ignore?
    assets = _.reject(assets, (asset) ->
      ignore.denies(asset.key)
    )

  if filter?
    assets = _.filter(assets, (asset) ->
      asset.key.match(new RegExp("^#{filter}"))
    )

  # console.log assets

  if argv['sync']
    for asset in assets
      await downloader({key: asset.key, target: target}, defer(err))
  else
    await
      for asset in assets
        downloader({key: asset.key, target: target}, defer(err))

  done()
