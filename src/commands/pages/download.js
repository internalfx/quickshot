
import _ from 'lodash'
import Promise from 'bluebird'
import { log, getTarget, mkdir, stringifyPage } from '../../helpers.js'
import ignoreParser from 'gitignore-parser'
import path from 'path'
import fsp from 'fs/promises'
import requestify from '../../requestify.js'
import context from '../../context.js'

export default async function (argv) {
  let ignore = null
  const config = context.config
  const target = await getTarget(config, argv)

  let total = 0
  const filter = argv.filter ? new RegExp(`^${argv.filter}`) : null

  try {
    const ignoreFile = await fsp.readFile(`.quickshot-ignore`, `utf8`)
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  let res = await requestify(target, {
    method: `get`,
    url: `/pages.json`,
    qs: {
      limit: 100,
    },
  })

  let done = false

  if (_.get(res, `body.pages.length`) === 0) {
    done = true
  }

  await mkdir(path.join(process.cwd(), `pages`))

  while (done === false) {
    let pages = _.get(res, `body.pages`)

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
      const res = await requestify(target, {
        method: `get`,
        url: `/pages/${page.id}/metafields.json`,
      })

      const metafields = _.get(res, `body.metafields`)

      page.metafields = metafields.map(function (metafield) {
        return _.pick(metafield, `key`, `namespace`, `value`, `type`, `description`)
      })

      await fsp.writeFile(path.join(process.cwd(), `pages`, `${page.handle}.html`), stringifyPage(page))

      total += 1

      await log(`Page "${page.handle}" downloaded`, `green`)
    })

    if (res.linkNext == null) {
      done = true
      break
    }

    res = await requestify(target, {
      method: `get`,
      url: `/pages.json`,
      qs: {
        limit: 100,
        page_info: res.linkNext.searchParams.get(`page_info`)
      },
    })
  }

  return `Downloaded ${total} pages.`
}
