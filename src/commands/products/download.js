
import _ from 'lodash'
import Promise from 'bluebird'
import { log, getTarget, mkdir, stringifyProduct } from '../../helpers.js'
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
    url: `/products.json`,
    qs: {
      limit: 100,
    },
  })

  let done = false

  if (_.get(res, `body.products.length`) === 0) {
    done = true
  }

  await mkdir(path.join(process.cwd(), `products`))

  while (done === false) {
    let products = _.get(res, `body.products`)

    if (ignore) {
      products = _.reject(products, function (page) {
        return ignore.denies(`pages/${page.handle}`)
      })
    }

    if (filter) {
      products = _.filter(products, function (page) {
        return filter.test(`pages/${page.handle}`)
      })
    }

    await Promise.map(products, async function (product) {
      const res = await requestify(target, {
        method: `get`,
        url: `/products/${product.id}/metafields.json`,
      })

      const metafields = _.get(res, `body.metafields`)

      product.metafields = metafields.map(function (metafield) {
        return _.pick(metafield, `key`, `namespace`, `value`, `type`, `description`)
      })

      await fsp.writeFile(path.join(process.cwd(), `products`, `${product.handle}.html`), stringifyProduct(product))

      total += 1

      await log(`Product "${product.handle}" downloaded`, `green`)
    })

    if (res.linkNext == null) {
      done = true
      break
    }

    res = await requestify(target, {
      method: `get`,
      url: `/products.json`,
      qs: {
        limit: 100,
        page_info: res.linkNext.searchParams.get(`page_info`)
      },
    })
  }

  return `Downloaded ${total} products.`
}
