
import AwaitLock from 'await-lock'

const _ = require('lodash')
const Promise = require('bluebird')
const moment = require('moment')
const { log, getTarget, loadConfig, to, mkdir } = require('../../helpers')
const ignoreParser = require('gitignore-parser')
const path = require('path')
const fs = require('fs')
Promise.promisifyAll(fs)
const requestify = require('../../requestify')
const chokidar = require('chokidar')

module.exports = async function (argv) {
  let ignore = null
  const config = await loadConfig()
  const target = await getTarget(config, argv)

  const lock = new AwaitLock()

  try {
    const ignoreFile = await fs.readFileAsync('.quickshot-ignore', 'utf8')
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  const watcher = chokidar.watch('./theme/', {
    ignored: /[/\\]\./,
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
    interval: 300,
    binaryInterval: 300,
    cwd: process.cwd()
  })

  watcher.on('all', async function (event, filePath) {
    if (argv.sync === true) { await lock.acquireAsync() }
    try {
      const pathParts = filePath.split(path.sep)
      const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, 'theme') + 1))
      const key = trimmedParts.join(path.sep)

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
        data = data.toString('base64')

        await requestify(target, {
          method: 'put',
          url: `/themes/${target.theme_id}/assets.json`,
          body: {
            asset: {
              key: key.split(path.sep).join('/'),
              attachment: data
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
    if (argv.sync === true) { await lock.release() }
  })

  if (argv.sync === true) {
    log('Two-Way sync is enabled!', 'yellow')

    const checkShopify = async function () {
      await lock.acquireAsync()
      try {
        const res = await requestify(target, {
          method: 'get',
          url: `/themes/${target.theme_id}/assets.json`
        })

        Promise.map(res.assets, async function (asset) {
          const stat = await to(fs.statAsync(path.join('theme', asset.key)))
          let fileExists = true

          if (stat.isError && stat.code === 'ENOENT') {
            fileExists = false
          }

          const key = asset.key
          const localMtime = moment(stat.mtime).toDate()
          const remoteMtime = moment(asset.updated_at).toDate()
          const localSize = stat.size
          const remoteSize = asset.size

          if (fileExists) {
            if (localSize === remoteSize) {
              return
            }

            if (localMtime > remoteMtime) {
              return
            }
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

          if (data.value === 'null') {
            return
          }

          let rawData = null

          if (data.attachment) {
            rawData = Buffer.from(data.attachment, 'base64')
          } else if (data.value) {
            rawData = Buffer.from(data.value, 'utf8')
          }

          await mkdir(path.join(process.cwd(), 'theme', path.dirname(data.key)))
          await fs.writeFileAsync(path.join(process.cwd(), 'theme', data.key), rawData)

          log(`Downloaded ${key}`, 'green')
        }, { concurrency: 1 })
      } catch (err) {
        log(err, 'red')
      }
      await lock.release()
      setTimeout(checkShopify, 3000)
    }

    setTimeout(checkShopify, 100)
  }

  log('watching theme...', 'green')
}
