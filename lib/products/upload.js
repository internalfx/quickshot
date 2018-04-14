
let _ = require('lodash')
let { log, loadConfig, getTarget } = require('../helpers')
let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
let path = require('path')
let glob = require('glob')
let asyncEach = require('../asyncEach')
let requestify = require('../requestify')

module.exports = function *(argv) {
  let config = yield loadConfig()
  let total = 0
  let productsDir = path.join(process.cwd(), 'products')

  let target = yield getTarget(config, argv)

  // Get existing collections
  let existingCollections = []
  let pageNum = 1

  while (true) {
    let {custom_collections} = yield requestify(target, {
      method: 'get',
      url: `/admin/custom_collections.json?limit=250&page=${pageNum}`
    });
    pageNum += 1

    if (custom_collections.length === 0) {
      break
    }

    existingCollections = existingCollections.concat(custom_collections)
  }

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

    let existingProduct

    try {
      existingProduct = yield requestify(target, {
        method: 'get',
        url: `/admin/products/${productData.id}.json`,
        data: { product: _.omit(productData, 'images', 'image') }
      })
    } catch (err) {
      // log(`Product "${productData.title}" doesn't exist and will be created`, 'yellow')
    }

    let shopifyProduct

    if (existingProduct) {
      shopifyProduct = yield requestify(target, {
        method: 'put',
        url: `/admin/products/${productData.id}.json`,
        data: { product: productData }
      })

      shopifyProduct = shopifyProduct.product

      yield asyncEach(productData.images, function *(prodImage) {
        let image = _.cloneDeep(prodImage)
        delete image.src

        let imgPath = yield Promise.fromCallback(function (cb) { glob(`${productPath}/${image.id.toString()}.@(jpg|jpeg|png|gif)`, cb) })
        imgPath = _.first(imgPath)
        let imgData

        if (imgPath) {
          imgData = yield fs.readFileAsync(imgPath)
        }

        image.attachment = imgData.toString('base64')

        requestify(target, {
          method: 'put',
          url: `/admin/products/${shopifyProduct.id}/images/${image.id}.json`,
          data: { image: image }
        })

        log(`Updated "${shopifyProduct.title}"`, 'green')
      }, {concurrency: config.concurrency})
    } else {
      shopifyProduct = yield requestify(target, {
        method: 'post',
        url: `/admin/products.json`,
        data: { product: _.omit(productData, 'images', 'image') }
      })

      shopifyProduct = shopifyProduct.product

      yield asyncEach(productData.images, function *(prodImage) {
        let image = _.cloneDeep(prodImage)
        let newVariantIds = []

        for (let variant_id of image.variant_ids) {
          let newVariant = shopifyProduct.variants[_.findIndex(productData.variants, {id: variant_id})]
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
          url: `/admin/products/${shopifyProduct.id}/images.json`,
          data: { image: image }
        })
      }, {concurrency: config.concurrency})

      // Custom Collections
      let productCollectionsJson

      try {
        productCollectionsJson = yield fs.readFileAsync(path.join(productPath, 'custom_collections.json'), 'utf8')
      } catch(err) {
        // log(err, 'red');
      }

      if (productCollectionsJson) {
        let productCollections = JSON.parse(productCollectionsJson)

        yield asyncEach(productCollections, function *(custom_collection) {
          let existingCollection
          if(existingCollection = _.find(existingCollections, { 'handle': custom_collection.handle })) {
            requestify(target, {
              method: 'post',
              url: '/admin/collects.json',
              data: { collect: { product_id: shopifyProduct.id, collection_id: existingCollection.id } }
            })

          } else {
            let shopifyCollection = yield requestify(target, {
              method: 'post',
              url: `/admin/custom_collections.json`,
              data: { custom_collection: custom_collection }
            })

            shopifyCollection = shopifyCollection.custom_collection

            if(custom_collection.image) {
              let image = _.cloneDeep(custom_collection.image)

              let imgPath = yield Promise.fromCallback(function (cb) { glob(`${collectionPath}/${path.basename(image.src, path.extname(image.src))}.@(jpg|jpeg|png|gif)`, cb) })
              imgPath = _.first(imgPath)
              let imgData

              if (imgPath) {
                imgData = yield fs.readFileAsync(imgPath)
              }

              image.attachment = imgData.toString('base64')

              delete image.src

              requestify(target, {
                method: 'post',
                url: `/admin/custom_collections/${shopifyCollection.id}/images.json`,
                data: { image: image }
              })
            }

            requestify(target, {
              method: 'post',
              url: '/admin/collects.json',
              data: { collect: { product_id: shopifyProduct.id, collection_id: shopifyCollection.id } }
            })

            existingCollections.push(shopifyCollection)
          }
        }, {concurrency: config.concurrency})
      }

      log(`Created "${shopifyProduct.title}"`, 'green')
    }

    total += 1
  }, {concurrency: config.concurrency})

  return `Uploaded ${total} products.`
}
