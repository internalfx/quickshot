
const _ = require(`lodash`)
const Promise = require(`bluebird`)
const { log, getTarget, loadConfig, parseArticle, parseProduct } = require(`../../helpers`)
// const path = require(`path`)
const fs = require(`fs`)
Promise.promisifyAll(fs)
const requestify = require(`../../requestify`)
const glob = require(`glob`)

module.exports = async function (argv) {
  const config = await loadConfig()
  const target = await getTarget(config, argv)

  const total = 0

  const productFilePaths = glob.sync(`products/*.html`, { nodir: true })

  await Promise.map(productFilePaths, async function (productFilePath) {
    const productSource = await fs.readFileAsync(productFilePath, `utf8`)
    const product = parseProduct(productSource)
    const metafields = product.metafields
    delete product.metafields

    // Get shopify product
    let res = await requestify(target, {
      method: `get`,
      url: `/products.json`,
      qs: {
        handle: product.handle
      }
    })

    let shopifyProduct = _.get(res, `body.products[0]`)

    if (shopifyProduct != null) {
      product.id = shopifyProduct.id

      res = await requestify(target, {
        method: `put`,
        url: `/products/${product.id}.json`,
        body: {
          product: product
        }
      })
    } else {
      res = await requestify(target, {
        method: `post`,
        url: `/products.json`,
        body: {
          product: product
        }
      })

      shopifyProduct = _.get(res, `body.product`)
    }

    res = await requestify(target, {
      method: `get`,
      url: `/products/${shopifyProduct.id}/metafields.json`
    })

    const shopifyMetafields = _.get(res, `body.metafields`)

    await Promise.map(metafields, async function (metafield) {
      const shopifyMetafield = shopifyMetafields.find(function (shopifyMetafield) {
        return shopifyMetafield.namespace === metafield.namespace && shopifyMetafield.key === metafield.key
      })

      if (shopifyMetafield != null) {
        metafield.id = shopifyMetafield.id

        res = await requestify(target, {
          method: `put`,
          url: `/products/${shopifyProduct.id}/metafields/${metafield.id}.json`,
          body: {
            metafield: metafield
          }
        })
      } else {
        res = await requestify(target, {
          method: `post`,
          url: `/products/${shopifyProduct.id}/metafields.json`,
          body: {
            metafield: metafield
          }
        })
      }
    })

    log(`Product "${product.handle}" uploaded`, `green`)
  }, { concurrency: 8 })

  return `Uploaded ${total} product articles.`
}
