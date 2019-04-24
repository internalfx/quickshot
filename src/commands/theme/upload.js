
let _ = require('lodash')
let Promise = require('bluebird')
let { log, getTarget, loadConfig } = require('../../helpers')
let ignoreParser = require('gitignore-parser')
let path = require('path')
let fs = require('fs')
Promise.promisifyAll(fs)
let requestify = require('../../requestify')
let glob = require('glob')

module.exports = async function (argv) {
  let ignore = null
  let config = await loadConfig()
  let target = await getTarget(config, argv)

  let total = 0
  // var filter = _.first(argv['_']) ? new RegExp(`^theme/${_.first(argv['_'])}`) : null

  try {
    let ignoreFile = await fs.readFileAsync('.quickshot-ignore', 'utf8')
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  let files = glob.sync('theme/**/*', { nodir: true })

  if (ignore) {
    files = _.reject(files, function (file) {
      return ignore.denies(file)
    })
  }

  // if (filter) {
  //   files = _.filter(files, function (file) {
  //     return filter.test(file)
  //   })
  // }

  files = files.map((file) => {
    let pathParts = file.split(path.sep)
    let trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, 'theme') + 1))
    let filepath = trimmedParts.join(path.sep)

    return {
      key: filepath,
      name: path.basename(filepath),
      path: file
    }
  })

  await Promise.map(files, async function (file) {
    let body = await fs.readFileAsync(file.path)
    await requestify(target, {
      method: 'put',
      url: `/themes/${target.theme_id}/assets.json`,
      body: {
        asset: {
          key: file.key,
          attachment: body.toString('base64')
        }
      }
    })

    total += 1
    log(`uploaded ${file.path}`, 'green')
  }, { concurrency: config.concurrency })

  return `Uploaded ${total} files.`
}
