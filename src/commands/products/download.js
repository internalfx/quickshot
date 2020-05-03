
const _ = require(`lodash`)
const Promise = require(`bluebird`)
const { log, getTarget, loadConfig, mkdir, stringifyProduct } = require(`../../helpers`)
const path = require(`path`)
const fs = require(`fs`)
Promise.promisifyAll(fs)
const requestify = require(`../../requestify`)

module.exports = async function (argv) {
  const config = await loadConfig()
  const target = await getTarget(config, argv)

  const total = 0

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

      await fs.writeFileAsync(path.join(process.cwd(), `products`, `${product.handle}.html`), stringifyProduct(product))

      log(`Product "${product.handle}" downloaded`, `green`)
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

  return `Downloaded ${total} articles.`
}
