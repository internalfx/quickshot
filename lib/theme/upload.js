
let _ = require('lodash')
let co = require('co')
let helpers = require('../helpers')
let parser = require('gitignore-parser')
let fs = require('fs')
let path = require('path')
let Promise = require('bluebird')

Promise.promisifyAll(fs)

var run = function *(argv) {
  var filter = _.first(argv['_'])
  var ignore = null

  var config = yield helpers.loadConfig()

  if (config.ignore_file) {
    ignore = parser.compile(yield fs.readFileAsync(config.ignore_file, 'utf8'))
  }

  var target = yield helpers.getTarget(config, argv)

  var files = yield helpers.listFiles('theme')

  files = files.map((file) => {
    let pathParts = file.split(path.sep)
    let trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, 'theme') + 1))
    let filepath = trimmedParts.join(path.sep)

    return {
      key: filepath,
      name: path.basename(filepath),
      fullpath: file
    }
  })

  if (ignore) {
    files = _.reject(files, function (file) {
      return ignore.denies(file.key)
    })
  }

  if (filter) {
    files = _.filter(files, function (file) {
      return new RegExp(`^${filter}`).test(file.key)
    })
  }

  files = _.reject(files, function (file) {
    return file.name.match(/^\..*$/)
  })

  var uploader = function (file) {
    return co(function *() {
      var data = yield fs.readFileAsync(file.fullpath)

      var cleanPath = file.key.split(path.sep).join('/')

      yield helpers.shopifyRequest({
        name: `upload: ${cleanPath}`,
        request: {
          method: 'put',
          url: `https://${target.domain}.myshopify.com/admin/themes/${target.theme_id}/assets.json`,
          headers: {'Authorization': target.auth},
          data: {
            asset: {
              key: cleanPath,
              attachment: data.toString('base64')
            }
          }
        }
      })

      helpers.log(`uploaded ${cleanPath}`, 'green')
    })
  }

  if (argv['sync']) {
    for (let file of files) {
      yield uploader(file)
    }
  } else {
    var pending = []

    for (let file of files) {
      pending.push(uploader(file))
    }

    yield Promise.all(pending)
  }

  return 'Done!'
}

module.exports = run
