
const _ = require('lodash')
const Promise = require('bluebird')
const { log, getTarget, loadConfig, mkdir, stringifyPage } = require('../../helpers')
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

  let res = await requestify(target, {
    method: 'get',
    url: '/pages.json',
    qs: {
      limit: 100
    }
  })

  let done = false

  if (_.get(res, 'body.pages.length') === 0) {
    done = true
  }

  while (done === false) {
    let pages = _.get(res, 'body.pages')

    if (ignore) {
      pages = _.reject(pages, function (page) {
        return ignore.denies(`pages/${page.handle}`)
      })
    }

    if (filter) {
      pages = _.filter(pages, function (page) {
        return filter.test(`pages/${page.handle}`)
      })
    }

    await Promise.map(pages, async function (page) {
      await mkdir(path.join(process.cwd(), 'pages'))
      await fs.writeFileAsync(path.join(process.cwd(), 'pages', `${page.handle}.html`), stringifyPage(page))

      total += 1
      log(`Downloaded ${page.handle}`, 'green')
    })

    if (res.linkNext == null) {
      done = true
      break
    }

    res = await requestify(target, {
      method: 'get',
      url: '/pages.json',
      qs: {
        limit: 100,
        page_info: res.linkNext.searchParams.get('page_info')
      }
    })
  }

  return `Downloaded ${total} pages.`
}
