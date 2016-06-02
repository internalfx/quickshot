
let _ = require('lodash')
let helpers = require('../helpers')
let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
let path = require('path')
let glob = require('glob')
let asyncEach = require('../asyncEach')
let requestify = require('../requestify')

module.exports = function *(argv) {
  let config = yield helpers.loadConfig()
  let total = 0
  let productsDir = path.join(process.cwd(), 'products')

  let target = yield helpers.getTarget(config, argv)

  let productDirs = fs.readdirSync(productsDir).filter(function (file) {
    return fs.statSync(path.join(productsDir, file)).isDirectory()
  })

  yield asyncEach(productDirs, function *(productDir) {
    let productPath = path.join(productsDir, productDir)

    let productJson = yield fs.readFileAsync(path.join(productPath, 'product.json'), 'utf8')
    let productData = JSON.parse(productJson)
    productData.body_html = yield fs.readFileAsync(path.join(productPath, 'product.html'), 'utf8')

    var metaJson = yield fs.readFileAsync(path.join(productPath, 'metafields.json'), 'utf8')
    var metafields = JSON.parse(metaJson)
    productData.metafields = metafields

    let newProduct = yield requestify(target, {
      method: 'post',
      url: `/admin/products.json`,
      data: { product: _.omit(productData, 'images', 'image') }
    })

    newProduct = newProduct.product

    yield asyncEach(productData.images, function *(prodImage) {
      let image = _.cloneDeep(prodImage)
      let newVariantIds = []

      for (let variant_id of image.variant_ids) {
        let newVariant = newProduct.variants[_.findIndex(productData.variants, {id: variant_id})]
        newVariantIds.push(newVariant.id)
      }

      image.variant_ids = newVariantIds
      delete image.src

      let imgPath = yield Promise.fromCallback(function (cb) { glob(`${productPath}/${image.id.toString()}.@(jpg|jpeg|png|gif)`, cb) })
      imgPath = _.first(imgPath)
      let imgData

      if (imgPath) {
        imgData = yield fs.readFileAsync(imgPath)
      }

      image.attachment = imgData.toString('base64')

      requestify(target, {
        method: 'post',
        url: `/admin/products/${newProduct.id}/images.json`,
        data: { image: image }
      })
    }, {concurrency: config.concurrency})

    total += 1
  }, {concurrency: config.concurrency})

  return `Uploaded ${total} products.`
}
