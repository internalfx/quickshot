
const _ = require('lodash')
const Promise = require('bluebird')
const { log, getTarget, loadConfig, mkdir, to } = require('../../helpers')
const ignoreParser = require('gitignore-parser')
const path = require('path')
const fs = require('fs')
Promise.promisifyAll(fs)
const requestify = require('../../requestify')

module.exports = async function (argv) {
  let ignore = null
  const config = await loadConfig()
  const target = await getTarget(config, argv)

  let total = 0
  var filter = argv.filter ? new RegExp(`^${argv.filter}`) : null

  try {
    const ignoreFile = await fs.readFileAsync('.quickshot-ignore', 'utf8')
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  const res = await requestify(target, {
    method: 'get',
    url: `/themes/${target.theme_id}/assets.json`
  })
  const assets = _.get(res, 'body.assets')

  if (ignore) {
    assets = _.reject(assets, function (asset) {
      return ignore.denies(`theme/${asset.key}`)
    })
  }

  if (filter) {
    assets = _.filter(assets, function (asset) {
      return filter.test(asset.key)
    })
  }

  await Promise.map(assets, async function (asset) {
    const res = await to(requestify(target, {
      method: 'get',
      url: `/themes/${target.theme_id}/assets.json`,
      qs: {
        'asset[key]': asset.key,
        theme_id: target.theme_id
      }
    }))

    if (res.isError) {
      log(res, 'red')
    } else {
      const data = _.get(res, 'body.asset')
      let rawData = null

      if (data.attachment) {
        rawData = Buffer.from(data.attachment, 'base64')
      } else if (data.value) {
        rawData = Buffer.from(data.value, 'utf8')
      }

      await mkdir(path.join(process.cwd(), 'theme', path.dirname(data.key)))
      await fs.writeFileAsync(path.join(process.cwd(), 'theme', data.key), rawData)

      total += 1
      log(`Downloaded ${data.key}`, 'green')
    }
  }, { concurrency: config.concurrency })

  return `Downloaded ${total} files.`
}
