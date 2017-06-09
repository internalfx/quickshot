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
    let {custom_collections: collections} = yield requestify(target, {
      method: 'get',
      url: `/admin/custom_collections.json?limit=250&page=${pageNum}`
    });
    pageNum += 1

    if (collections.length === 0) {
      break
    }

    yield asyncEach(collections, function *(collection, idx) {
      let collectionDir = path.join(process.cwd(), 'collections', collection.handle)

      yield fs.mkdirpAsync(collectionDir)
      yield fs.writeFileAsync(path.join(collectionDir, 'collection.json'), JSON.stringify(collection))

      let {metafields} = yield requestify(target, {
        method: 'get',
        url: `/admin/custom_collections/${collection.id}/metafields.json`
      })

      yield fs.writeFileAsync(path.join(collectionDir, 'metafields.json'), JSON.stringify(metafields))

      if (collection.image) {
        image = collection.image
        let ext = path.parse(url.parse(image.src).pathname).ext
        let result = yield axios({
          url: image.src,
          responseType: 'arraybuffer'
        })

        yield fs.writeFileAsync(path.join(collectionDir, `${path.basename(image.src, path.extname(image.src))}${ext}`), result.data)
      }

      total += 1

      log(`Downloaded "${collection.title}"`, 'green')
    }, {concurrency: config.concurrency})
  }

  return `Downloaded ${total} collections.`
}
