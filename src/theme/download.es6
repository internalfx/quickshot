
import _ from 'lodash'
import co from 'co'
import * as helpers from '../helpers'
import parser from 'gitignore-parser'
import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
Promise.promisifyAll(fs)

var run = function *(argv) {
  var filter = _.first(argv['_'])

  var ignore = null
  var config = yield helpers.loadConfig()

  if (config.ignore_file) {
    ignore = parser.compile(yield fs.readFileAsync(config.ignore_file, 'utf8'))
  }

  var target = yield helpers.getTarget(config, argv)

  var assets = yield helpers.shopifyRequest({
    name: 'Retrieve Asset list',
    request: {
      method: 'get',
      url: `https://${target.domain}.myshopify.com/admin/themes/${target.theme_id}/assets.json`,
      headers: {'Authorization': target.auth}
    }
  })

  assets = assets.data.assets

  if (ignore) {
    assets = _.reject(assets, function (asset) {
      return ignore.denies(asset.key)
    })
  }

  if (filter) {
    assets = _.filter(assets, function (asset) {
      return new RegExp(`^${filter}`).test(asset.key)
    })
  }

  console.log(assets)
  
}

export default run

// downloader = (ctx, cb) ->
//
//   await helpers.shopifyRequest({
//     filepath: ctx.key
//     method: 'get'
//     url: "https://#{ctx.target.api_key}:#{ctx.target.password}@#{ctx.target.domain}.myshopify.com/admin/themes/#{ctx.target.theme_id}/assets.json"
//     qs: {
//       asset: {key: ctx.key}
//     }
//   }, defer(err, res, data))
//   if err?
//     helpers.log(err, 'red')
//     cb(err)
//
//   helpers.log("Downloaded #{ctx.key}", 'green')
//
//   if data.asset.attachment
//     rawData = new Buffer(data.asset.attachment, 'base64')
//   else if data.asset.value
//     rawData = new Buffer(data.asset.value, 'utf8')
//
//   await mkdirp(path.join(process.cwd(), 'theme', path.dirname(data.asset.key)), defer(err))
//   await fs.writeFile(path.join(process.cwd(), 'theme', data.asset.key), rawData, defer(err))
//   if err?
//     helpers.log(err, 'red')
//     cb(err)
//
//   cb()
//
//
// exports.run = (argv, done) ->
//   filter = _.first(argv['_'])
//
//   await helpers.loadConfig(defer(err, config))
//   if err? then return done(err)
//
//   if config.ignore_file
//     ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'))
//
//   await helpers.getTarget(config, argv, defer(err, target))
//   if err? then return done(err)
//
//   await helpers.shopifyRequest({
//     method: 'get'
//     url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/themes/#{target.theme_id}/assets.json"
//   }, defer(err, res, assetsBody))
//   if err? then return done(err)
//
//   assets = assetsBody.assets
//
//   if ignore?
//     assets = _.reject(assets, (asset) ->
//       ignore.denies(asset.key)
//     )
//
//   if filter?
//     assets = _.filter(assets, (asset) ->
//       asset.key.match(new RegExp("^#{filter}"))
//     )
//
//   # console.log assets
//
//   if argv['sync']
//     for asset in assets
//       await downloader({key: asset.key, target: target}, defer(err))
//   else
//     await
//       for asset in assets
//         downloader({key: asset.key, target: target}, defer(err))
//
//   done()
