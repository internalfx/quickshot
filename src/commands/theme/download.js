
let _ = require('lodash')
let Promise = require('bluebird')
let { log, getTarget, loadConfig, mkdir } = require('../../helpers')
let ignoreParser = require('gitignore-parser')
let path = require('path')
let fs = require('fs')
Promise.promisifyAll(fs)
let requestify = require('../../requestify')

module.exports = async function (argv) {
  let ignore = null
  let config = await loadConfig()
  let target = await getTarget(config, argv)

  let total = 0
  var filter = argv.filter ? new RegExp(`^${argv.filter}`) : null

  try {
    let ignoreFile = await fs.readFileAsync('.quickshot-ignore', 'utf8')
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  var { assets } = await requestify(target, {
    method: 'get',
    url: `/themes/${target.theme_id}/assets.json`
  })

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
    let data = await requestify(target, {
      method: 'get',
      url: `/themes/${target.theme_id}/assets.json`,
      qs: {
        'asset[key]': asset.key,
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

    await mkdir(path.join(process.cwd(), 'theme', path.dirname(data.key)))
    await fs.writeFileAsync(path.join(process.cwd(), 'theme', data.key), rawData)

    total += 1
    log(`Downloaded ${data.key}`, 'green')
  }, { concurrency: config.concurrency })

  return `Downloaded ${total} files.`
}
