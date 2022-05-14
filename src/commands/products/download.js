
import _ from 'lodash'
import Promise from 'bluebird'
import { log, getTarget, mkdir, stringifyProduct } from '../../helpers.js'
import path from 'path'
import fsp from 'fs/promises'
import requestify from '../../requestify.js'
import context from '../../context.js'

export default async function (argv) {
  const config = context.config
  const target = await getTarget(config, argv)

  let total = 0

  const processProducts = async function (products) {
    await Promise.map(products, async function (product) {
      const res = await requestify(target, {
        method: `get`,
        url: `/products/${product.id}/metafields.json`
      })

      const metafields = _.get(res, `body.metafields`)

      product.metafields = metafields.map(function (metafield) {
        return _.pick(metafield, `namespace`, `key`, `value`, `value_type`)
      })

      await fsp.writeFile(path.join(process.cwd(), `products`, `${product.handle}.html`), stringifyProduct(product))

      total += 1

      await log(`Product "${product.handle}" downloaded`, `green`)
    })
  }

  let res = await requestify(target, {
    method: `get`,
    url: `/products.json`,
    qs: {
      limit: 100
    }
  })

  let productsDone = false

  if (_.get(res, `body.products.length`) === 0) {
    productsDone = true
  }

  await mkdir(path.join(process.cwd(), `products`))

  // Process Products
  while (productsDone === false) {
    const products = _.get(res, `body.products`)

    await processProducts(products)

    if (res.linkNext == null) {
      productsDone = true
      break
    }

    res = await requestify(target, {
      method: `get`,
      url: `/products.json`,
      qs: {
        limit: 100,
        page_info: res.linkNext.searchParams.get(`page_info`)
      }
    })
  }

  return `Downloaded ${total} products.`
}
