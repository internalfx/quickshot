
let { log, loadConfig, getTarget } = require('../helpers')

let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
// let _ = require('lodash')

let axios = require('axios')
let path = require('path')
let url = require('url')
let asyncEach = require('../asyncEach')
let requestify = require('../requestify')

module.exports = function *(argv) {
  // let filter = _.first(argv['_'])
  let config = yield loadConfig()
  let total = 0
  let pageNum = 1
  let target = yield getTarget(config, argv)

  while (true) {
    let {products} = yield requestify(target, {
      method: 'get',
      url: `/admin/products.json?limit=250&page=${pageNum}`
    })
    pageNum += 1

    if (products.length === 0) {
      break
    }

    yield asyncEach(products, function *(product, idx) {
      let prodDir = path.join(process.cwd(), 'products', product.handle)

      yield fs.mkdirpAsync(prodDir)

      let body_html = product.body_html
      delete product.body_html

      yield fs.writeFileAsync(path.join(prodDir, 'product.json'), JSON.stringify(product))
      yield fs.writeFileAsync(path.join(prodDir, 'product.html'), body_html)

      let {metafields} = yield requestify(target, {
        method: 'get',
        url: `/admin/products/${product.id}/metafields.json`
      })

      yield fs.writeFileAsync(path.join(prodDir, 'metafields.json'), JSON.stringify(metafields))

      yield asyncEach(product.images, function *(image, idx) {
        let ext = path.parse(url.parse(image.src).pathname).ext
        let result = yield axios({
          url: image.src,
          responseType: 'arraybuffer'
        })

        yield fs.writeFileAsync(path.join(prodDir, `${image.id}${ext}`), result.data)
      }, {concurrency: config.concurrency})

      let {custom_collections} = yield requestify(target, {
        method: 'get',
        url: `/admin/custom_collections.json?product_id=${product.id}`
      })

      if (custom_collections.length > 0) {
        yield fs.writeFileAsync(path.join(prodDir, 'custom_collections.json'), JSON.stringify(custom_collections))
      }

      total += 1

      log(`Downloaded "${product.title}"`, 'green')
    }, {concurrency: config.concurrency})
  }

  return `Downloaded ${total} products.`
}
