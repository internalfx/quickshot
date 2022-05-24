
import _ from 'lodash'
import Promise from 'bluebird'
import { log, getTarget, parsePage } from '../../helpers.js'
import ignoreParser from 'gitignore-parser'
import path from 'path'
import fsp from 'fs/promises'
import requestify from '../../requestify.js'
import glob from 'glob'
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
    const source = await fsp.readFile(file.path, `utf8`)
    const page = parsePage(source)
    const metafields = page.metafields
    delete page.metafields

    let res = await requestify(target, {
      method: `get`,
      url: `/pages.json`,
      qs: {
        handle: page.handle,
      },
    })

    let shopifyPage = _.get(res, `body.pages[0]`)

    if (shopifyPage != null) {
      page.id = shopifyPage.id

      res = await requestify(target, {
        method: `put`,
        url: `/pages/${page.id}.json`,
        body: {
          page,
        },
      })
    } else {
      res = await requestify(target, {
        method: `post`,
        url: `/pages.json`,
        body: {
          page,
        },
      })

      shopifyPage = _.get(res, `body.page`)
    }

    res = await requestify(target, {
      method: `get`,
      url: `/pages/${shopifyPage.id}/metafields.json`,
    })

    const shopifyMetafields = _.get(res, `body.metafields`)

    await Promise.map(metafields, async function (metafield) {
      const shopifyMetafield = shopifyMetafields.find(function (shopifyMetafield) {
        return shopifyMetafield.namespace === metafield.namespace &&
        shopifyMetafield.key === metafield.key
      })

      if (shopifyMetafield != null) {
        metafield.id = shopifyMetafield.id

        res = await requestify(target, {
          method: `put`,
          url: `/pages/${shopifyPage.id}/metafields/${metafield.id}.json`,
          body: {
            metafield: metafield,
          },
        })
      } else {
        res = await requestify(target, {
          method: `post`,
          url: `/pages/${shopifyPage.id}/metafields.json`,
          body: {
            metafield: metafield,
          },
        })
      }
    })

    total += 1

    await log(`Page "${page.handle}" uploaded`, `green`)
  }, { concurrency: config.concurrency })

  return `Uploaded ${total} pages.`
}
