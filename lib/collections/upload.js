
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
  let collectionsDir = path.join(process.cwd(), 'collections')

  let target = yield getTarget(config, argv)

  let collectionDirs = fs.readdirSync(collectionsDir).filter(function (file) {
    return fs.statSync(path.join(collectionsDir, file)).isDirectory()
  })

  yield asyncEach(collectionDirs, function *(collectionDir) {
    let collectionPath = path.join(collectionsDir, collectionDir)

    let collectionJson = yield fs.readFileAsync(path.join(collectionPath, 'collection.json'), 'utf8')
    let collectionData = JSON.parse(collectionJson)

    var metaJson = yield fs.readFileAsync(path.join(collectionPath, 'metafields.json'), 'utf8')
    var metafields = JSON.parse(metaJson)
    collectionData.metafields = metafields.map(field => _.omit(field, 'id'));

    let existingCollection

    try {
      existingCollection = yield requestify(target, {
        method: 'get',
        url: `/admin/custom_collections/${collectionData.id}.json`,
        data: { custom_collection: collectionData }
      })
    } catch (err) {
      // log(`Collection "${collectionData.title}" doesn't exist and will be created`, 'yellow')
    }

    let shopifyCollection

    if (existingCollection) {
      shopifyCollection = yield requestify(target, {
        method: 'put',
        url: `/admin/custom_collections/${collectionData.id}.json`,
        data: { custom_collection: collectionData }
      })

      shopifyCollection = shopifyCollection.custom_collection

      if(collectionData.image) {
        let image = _.cloneDeep(collectionData.image)

        let imgPath = yield Promise.fromCallback(function (cb) { glob(`${collectionPath}/${path.basename(image.src, path.extname(image.src))}.@(jpg|jpeg|png|gif)`, cb) })
        imgPath = _.first(imgPath)
        let imgData

        if (imgPath) {
          imgData = yield fs.readFileAsync(imgPath)
        }

        image.attachment = imgData.toString('base64')

        delete image.src

        requestify(target, {
          method: 'put',
          url: `/admin/custom_collections/${shopifyCollection.id}/images/${image.id}.json`,
          data: { image: image }
        })
      }

      log(`Updated "${shopifyCollection.title}"`, 'green')

    } else {
      shopifyCollection = yield requestify(target, {
        method: 'post',
        url: `/admin/custom_collections.json`,
        data: { custom_collection: collectionData }
      })

      shopifyCollection = shopifyCollection.custom_collection

      if(collectionData.image) {
        let image = _.cloneDeep(collectionData.image)

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

      log(`Created "${shopifyCollection.title}"`, 'green')
    }

    total += 1
  }, {concurrency: config.concurrency})

  return `Uploaded ${total} collections.`
}
