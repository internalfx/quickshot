
helpers = require('../helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
path = require('path')
request = require('request')
mkdirp = require('mkdirp')
parser = require('gitignore-parser')

exports.run = (argv, done) ->
  filter = _.first(argv['_'])

  await helpers.loadConfig(defer(err, config))
  if err? then return done(err)

  if config.ignore_file
    ignore = parser.compile(fs.readFileSync(config.ignore_file, 'utf8'))

  await helpers.getTarget(config, argv, defer(err, target))
  if err? then return done(err)

  page = 0
  productsDownloaded = 0

  loop
    page += 1
    await helpers.shopifyRequest({
      method: 'get'
      url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/products.json?page=#{page}"
    }, defer(err, res, productsBody))
    if err? then return done(err)

    products = productsBody.products

    break unless _.isArray(products) and products.length isnt 0

    productsDownloaded += products.length

    console.log "Products downloaded: #{productsDownloaded}"

    await
      for product in products
        ((product, cb) ->
          key = "products/#{product.handle}/product.json"

          await mkdirp(path.dirname(key), defer(err))
          await fs.writeFile(key, JSON.stringify(product), defer(err))

          await helpers.shopifyRequest({
            method: 'get'
            url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/products/#{product.id}/metafields.json"
          }, defer(err, res, metafieldsBody))
          if err? then return cb(err)

          await fs.writeFile("products/#{product.handle}/metafields.json", JSON.stringify(metafieldsBody), defer(err))

          for image in product.images
            await request(image.src).pipe(fs.createWriteStream("products/#{product.handle}/#{image.id}")).on('close', defer(err));

          console.log colors.green("Downloaded #{key}")

          return cb()
        )(product, defer(err))

  done()
