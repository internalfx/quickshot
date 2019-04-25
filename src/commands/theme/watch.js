
let _ = require('lodash')
let Promise = require('bluebird')
let moment = require('moment')
let { log, getTarget, loadConfig } = require('../../helpers')
let ignoreParser = require('gitignore-parser')
let path = require('path')
let fs = require('fs')
Promise.promisifyAll(fs)
let requestify = require('../../requestify')
let chokidar = require('chokidar')

module.exports = async function (argv) {
  let ignore = null
  let config = await loadConfig()
  let target = await getTarget(config, argv)

  try {
    let ignoreFile = await fs.readFileAsync('.quickshot-ignore', 'utf8')
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  let watcher = chokidar.watch('./theme/', {
    ignored: /[/\\]\./,
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
    interval: 300,
    binaryInterval: 300,
    cwd: process.cwd()
  })

  watcher.on('all', async function (event, filePath) {
    try {
      let pathParts = filePath.split(path.sep)
      let trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, 'theme') + 1))
      let key = trimmedParts.join(path.sep)

      if (!filePath.match(/^theme/)) { return }
      if (filePath.match(/^\..*$/)) { return }
      if (filePath.match(/[()]/)) {
        log(`Filename may not contain parentheses, please rename - "${filePath}"`, 'red')
        return
      }

      if (ignore && ignore.denies(filePath)) {
        log(`IGNORING: ${filePath}`, 'yellow')
        return
      }

      if (['add', 'change'].includes(event)) {
        let data = await fs.readFileAsync(filePath)
        await requestify(target, {
          method: 'put',
          url: `/themes/${target.theme_id}/assets.json`,
          body: {
            asset: {
              key: key.split(path.sep).join('/'),
              attachment: data.toString('base64')
            }
          }
        })

        log(`Added/Updated ${filePath}`, 'green')
      } else if (event === 'unlink') {
        await requestify(target, {
          method: 'delete',
          url: `/themes/${target.theme_id}/assets.json?asset[key]=${key.split(path.sep).join('/')}`
        })

        log(`Deleted ${filePath}`, 'green')
      }
    } catch (err) {
      log(err, 'red')
    }
  })

  if (argv.sync === true) {
    log('Two-Way sync is enabled!', 'yellow')

    let checkShopify = async function () {
      try {
        let res = await requestify(target, {
          method: 'get',
          url: `/themes/${target.theme_id}/assets.json`
        })

        Promise.map(res.assets, async function (asset) {
          let stat = await fs.statAsync(path.join('theme', asset.key))
          let key = asset.key
          let localMtime = moment(stat.mtime).toDate()
          let remoteMtime = moment(asset.updated_at).toDate()
          let localSize = stat.size
          let remoteSize = asset.size

          if (localSize === remoteSize) {
            return
          }

          if (localMtime > remoteMtime) {
            return
          }

          let data = await requestify(target, {
            method: 'get',
            url: `/themes/${target.theme_id}/assets.json`,
            qs: {
              'asset[key]': key,
              theme_id: target.theme_id
            }
          })

          data = data.asset
          let rawData = null

          if (data.attachment) {
            rawData = Buffer.from(data.attachment, 'base64')
          } else if (data.value) {
            rawData = Buffer.from(data.value, 'utf8')
          }

          await fs.mkdirAsync(path.join(process.cwd(), 'theme', path.dirname(data.key)), { recursive: true })
          await fs.writeFileAsync(path.join(process.cwd(), 'theme', data.key), rawData)

          log(`Downloaded ${key}`, 'green')
        }, { concurrency: 1 })
      } catch (err) {
        log(err, 'red')
      }
      setTimeout(checkShopify, 5000)
    }

    setTimeout(checkShopify, 1000)
  }

  log('watching theme...', 'green')
}
