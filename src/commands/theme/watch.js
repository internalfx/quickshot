
import { awaitLock } from '../../ifxLock.js'
import _ from 'lodash'
import Promise from 'bluebird'
import moment from 'moment'
import { log, getTarget, to, mkdir } from '../../helpers.js'
import ignoreParser from 'gitignore-parser'
import path from 'path'
import fsp from 'fs/promises'
import requestify from '../../requestify.js'
import chokidar from 'chokidar'
import context from '../../context.js'

export default async function (argv) {
  let ignore = null
  const config = context.config
  const target = await getTarget(config, argv)

  try {
    const ignoreFile = await fsp.readFile(`.quickshot-ignore`, `utf8`)
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  const watcher = chokidar.watch(`./theme/`, {
    ignored: /[/\\]\./,
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
    interval: 300,
    binaryInterval: 300,
    cwd: process.cwd()
  })

  watcher.on(`all`, async function (event, filePath) {
    let lock
    if (argv.sync === true) { lock = await awaitLock('watch') }
    try {
      const pathParts = filePath.split(path.sep)
      const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, `theme`) + 1))
      const key = trimmedParts.join(path.sep)

      if (!filePath.match(/^theme/)) { return }
      if (filePath.match(/^\..*$/)) { return }
      if (filePath.match(/[()]/)) {
        await log(`Filename may not contain parentheses, please rename - "${filePath}"`, `red`)
        return
      }

      if (ignore && ignore.denies(filePath)) {
        await log(`IGNORING: ${filePath}`, `yellow`)
        return
      }

      if ([`add`, `change`].includes(event)) {
        let data = await fsp.readFile(filePath)
        data = data.toString(`base64`)

        await requestify(target, {
          method: `put`,
          url: `/themes/${target.theme_id}/assets.json`,
          body: {
            asset: {
              key: key.split(path.sep).join(`/`),
              attachment: data
            }
          }
        })

        await log(`Added/Updated ${filePath}`, `green`)
      } else if (event === `unlink`) {
        await requestify(target, {
          method: `delete`,
          url: `/themes/${target.theme_id}/assets.json?asset[key]=${key.split(path.sep).join(`/`)}`
        })

        await log(`Deleted ${filePath}`, `green`)
      }
    } catch (err) {
      await log(err, `red`)
    }
    if (argv.sync === true) { lock.release() }
  })

  if (argv.sync === true) {
    await log(`Two-Way sync is enabled!`, `yellow`)

    const checkShopify = async function () {
      let lock = await awaitLock('watch')
      try {
        const res = await requestify(target, {
          method: `get`,
          url: `/themes/${target.theme_id}/assets.json`
        })
        const assets = _.get(res, `body.assets`)

        Promise.map(assets, async function (asset) {
          const stat = await to(fsp.stat(path.join(`theme`, asset.key)))
          let fileExists = true

          if (stat.isError && stat.code === `ENOENT`) {
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

          const res = await requestify(target, {
            method: `get`,
            url: `/themes/${target.theme_id}/assets.json`,
            qs: {
              'asset[key]': key,
              theme_id: target.theme_id
            }
          })
          const data = _.get(res, `body.asset`)

          if (data.value === `null`) {
            return
          }

          let rawData = null

          if (data.attachment) {
            rawData = Buffer.from(data.attachment, `base64`)
          } else if (data.value) {
            rawData = Buffer.from(data.value, `utf8`)
          }

          await mkdir(path.join(process.cwd(), `theme`, path.dirname(data.key)))
          await fsp.writeFile(path.join(process.cwd(), `theme`, data.key), rawData)

          await log(`Downloaded ${key}`, `green`)
        }, { concurrency: 1 })
      } catch (err) {
        await log(err, `red`)
      }
      lock.release()
      setTimeout(checkShopify, 3000)
    }

    setTimeout(checkShopify, 100)
  }

  await log(`watching theme...`, `green`)
}
