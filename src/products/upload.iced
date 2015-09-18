
helpers = require('../helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')
walk = require('walk')
parser = require('gitignore-parser')

exports.run = (argv, done) ->

  filter = _.first(argv['_'])

  await helpers.loadConfig(defer(err, config))
  if err? then done(err)

  if config.ignore_file
    ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'))

  await helpers.getTarget(config, argv, defer(err, target))
  if err? then return done(err)

  productDirs = fs.readdirSync(path.join(process.cwd(), 'products')).filter((file) ->
    return fs.statSync(path.join(process.cwd(), 'products', file)).isDirectory()
  )

  for productDir in productDirs
    prodPath = path.join(process.cwd(), 'products', productDir)

    await fs.readFile(path.join(prodPath, 'product.json'), defer(err, prodJson))
    prodData = JSON.parse(prodJson)

    await helpers.shopifyRequest({
      method: 'post'
      url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/products.json"
      json: { product: _.omit(prodData, 'images', 'image') }
    }, defer(err, res, assetsBody))

    newProdData = assetsBody.product

    await
      for prodImage in prodData.images
        ((prodImage, cb)->
          image = _.cloneDeep(prodImage)
          newVariantIds = []

          for variant_id in image.variant_ids
            newVariant = newProdData.variants[_.findIndex(prodData.variants, {id: variant_id})]
            newVariantIds.push(newVariant.id)

          image.variant_ids = newVariantIds
          delete image.src

          await fs.readFile(path.join(prodPath, image.id.toString()), defer(err, imgData))
          if err?
            helpers.log("Image #{image.id} missing for product #{prodData.handle}", 'red')
            return cb(err)

          image.attachment = imgData.toString('base64')

          await helpers.shopifyRequest({
            method: 'post'
            url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/products/#{newProdData.id}/images.json"
            json: { image: image }
          }, defer(err, res, requestBody))
          if err? then return cb(err)

          return cb()
        )(prodImage, defer(err))

    await fs.readFile(path.join(prodPath, 'metafields.json'), defer(err, metaJson))
    metaData = JSON.parse(metaJson)

    await
      for metafield in metaData.metafields
        ((metafield, cb)->
          await helpers.shopifyRequest({
            method: 'post'
            url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/products/#{newProdData.id}/metafields.json"
            json: { metafield: metafield }
          }, defer(err, res, requestBody))
          if err? then return cb(err)

          return cb()
        )(metafield, defer(err))

    helpers.log("Created #{newProdData.handle}", 'green')
