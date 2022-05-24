
import _ from 'lodash'
import Promise from 'bluebird'
import { log, getTarget, parseProduct } from '../../helpers.js'
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

  let files = glob.sync(`products/*.html`, { nodir: true })

  if (ignore) {
    files = _.reject(files, function (file) {
      return ignore.denies(file)
    })
  }

  if (filter) {
    files = _.filter(files, function (file) {
      const pathParts = file.split(path.sep)
      const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, `products`) + 1))
      const key = trimmedParts.join(`/`)
      return filter.test(key)
    })
  }

  files = files.map((file) => {
    const pathParts = file.split(path.sep)
    const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, `products`) + 1))
    const filepath = trimmedParts.join(path.sep)

    return {
      key: filepath,
      name: path.basename(filepath),
      path: file,
    }
  })

  await Promise.map(files, async function (file) {
    const source = await fsp.readFile(file.path, `utf8`)
    const product = parseProduct(source)
    const metafields = product.metafields
    delete product.metafields

    let res = await requestify(target, {
      method: `get`,
      url: `/products.json`,
      qs: {
        handle: product.handle,
      },
    })

    let shopifyProduct = _.get(res, `body.products[0]`)

    if (shopifyProduct != null) {
      product.id = shopifyProduct.id

      res = await requestify(target, {
        method: `put`,
        url: `/products/${product.id}.json`,
        body: {
          product,
        },
      })
    } else {
      res = await requestify(target, {
        method: `post`,
        url: `/products.json`,
        body: {
          product,
        },
      })

      shopifyProduct = _.get(res, `body.product`)
    }

    res = await requestify(target, {
      method: `get`,
      url: `/products/${shopifyProduct.id}/metafields.json`,
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
          url: `/products/${shopifyProduct.id}/metafields/${metafield.id}.json`,
          body: {
            metafield: metafield,
          },
        })
      } else {
        res = await requestify(target, {
          method: `post`,
          url: `/products/${shopifyProduct.id}/metafields.json`,
          body: {
            metafield: metafield,
          },
        })
      }
    })

    total += 1

    await log(`Product "${product.handle}" uploaded`, `green`)
  }, { concurrency: config.concurrency })

  return `Uploaded ${total} products.`
}
