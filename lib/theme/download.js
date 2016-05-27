
let _ = require('lodash')
let co = require('co')
let helpers = require('../helpers')
let parser = require('gitignore-parser')
let fs = require('fs')
let path = require('path')
let mkdirp = require('mkdirp')
let Promise = require('bluebird')
fs.mkdirp = mkdirp
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

  var downloader = function (key) {
    return co(function *() {
      var res = yield helpers.shopifyRequest({
        name: `request: ${key}`,
        request: {
          url: `https://${target.domain}.myshopify.com/admin/themes/${target.theme_id}/assets.json`,
          headers: {'Authorization': target.auth},
          params: {
            'asset[key]': key,
            theme_id: target.theme_id
          }
        }
      })

      helpers.log(`downloaded ${key}`, 'green')

      var data = res.data
      var rawData = null

      if (data.asset.attachment) {
        rawData = new Buffer(data.asset.attachment, 'base64')
      } else if (data.asset.value) {
        rawData = new Buffer(data.asset.value, 'utf8')
      }

      yield fs.mkdirpAsync(path.join(process.cwd(), 'theme', path.dirname(key)))
      yield fs.writeFileAsync(path.join(process.cwd(), 'theme', key), rawData)
    })
  }

  if (argv['sync']) {
    for (let asset of assets) {
      yield downloader(asset.key)
    }
  } else {
    var pending = []

    for (let asset of assets) {
      pending.push(downloader(asset.key))
    }

    yield Promise.all(pending)
  }

  return 'Done!'
}

module.exports = run
