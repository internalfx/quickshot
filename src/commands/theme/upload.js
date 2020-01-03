
const _ = require('lodash')
const Promise = require('bluebird')
const { log, getTarget, loadConfig, to } = require('../../helpers')
const ignoreParser = require('gitignore-parser')
const path = require('path')
const fs = require('fs')
Promise.promisifyAll(fs)
const requestify = require('../../requestify')
const glob = require('glob')

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

  let files = glob.sync('theme/**/*', { nodir: true })

  if (ignore) {
    files = _.reject(files, function (file) {
      return ignore.denies(file)
    })
  }

  if (filter) {
    files = _.filter(files, function (file) {
      const pathParts = file.split(path.sep)
      const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, 'theme') + 1))
      const key = trimmedParts.join('/')
      return filter.test(key)
    })
  }

  files = files.map((file) => {
    const pathParts = file.split(path.sep)
    const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, 'theme') + 1))
    const filepath = trimmedParts.join(path.sep)

    return {
      key: filepath,
      name: path.basename(filepath),
      path: file
    }
  })

  await Promise.map(files, async function (file) {
    const body = await fs.readFileAsync(file.path)
    const res = await to(requestify(target, {
      method: 'put',
      url: `/themes/${target.theme_id}/assets.json`,
      body: {
        asset: {
          key: file.key,
          attachment: body.toString('base64')
        }
      }
    }))

    if (res.isError) {
      log(res, 'red')
    } else {
      total += 1
      log(`uploaded ${file.key}`, 'green')
    }
  }, { concurrency: config.concurrency })

  return `Uploaded ${total} files.`
}
