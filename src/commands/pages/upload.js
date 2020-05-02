
const _ = require(`lodash`)
const Promise = require(`bluebird`)
const { log, getTarget, loadConfig, to, parsePage } = require(`../../helpers`)
const ignoreParser = require(`gitignore-parser`)
const path = require(`path`)
const fs = require(`fs`)
Promise.promisifyAll(fs)
const requestify = require(`../../requestify`)
const glob = require(`glob`)

module.exports = async function (argv) {
  let ignore = null
  const config = await loadConfig()
  const target = await getTarget(config, argv)

  let total = 0
  var filter = argv.filter ? new RegExp(`^${argv.filter}`) : null

  try {
    const ignoreFile = await fs.readFileAsync(`.quickshot-ignore`, `utf8`)
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  let files = glob.sync(`pages/*`, { nodir: true })

  if (ignore) {
    files = _.reject(files, function (file) {
      return ignore.denies(file)
    })
  }

  if (filter) {
    files = _.filter(files, function (file) {
      const pathParts = file.split(path.sep)
      const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, `pages`) + 1))
      const key = trimmedParts.join(`/`)
      return filter.test(key)
    })
  }

  files = files.map((file) => {
    const pathParts = file.split(path.sep)
    const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, `pages`) + 1))
    const filepath = trimmedParts.join(path.sep)

    return {
      key: filepath,
      name: path.basename(filepath),
      path: file
    }
  })

  await Promise.map(files, async function (file) {
    const source = await fs.readFileAsync(file.path, `utf8`)
    const page = parsePage(source)

    let res = await requestify(target, {
      method: `get`,
      url: `/pages.json`,
      qs: {
        handle: page.handle
      }
    })

    const shopifyPage = _.get(res, `body.pages[0]`)

    if (shopifyPage != null) {
      page.id = shopifyPage.id

      res = await requestify(target, {
        method: `put`,
        url: `/pages/${page.id}.json`,
        body: {
          page: _.pick(page, `id`, `body_html`, `author`, `title`, `handle`)
        }
      })
    } else {
      res = await requestify(target, {
        method: `post`,
        url: `/pages.json`,
        body: {
          page: _.pick(page, `body_html`, `author`, `title`, `handle`)
        }
      })
    }

    if (res.isError) {
      log(res, `red`)
    } else {
      total += 1
      log(`uploaded ${file.key}`, `green`)
    }
  }, { concurrency: config.concurrency })

  return `Uploaded ${total} pages.`
}
