
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

  await helpers.getShopPages(target, defer(err, pages))
  if err? then return done(err)

  walker = walk.walk(path.join(process.cwd(), 'pages'), { followLinks: false })

  walker.on("file", (root, fileStat, next) ->
    filepath = path.join(root, fileStat.name).replace(process.cwd()+"/", "")

    # Ignore hidden files
    if filepath.match(/^\..*$/) then return next()

    # Ignore paths configured in ignore file
    if config.ignore_file
      if ignore.denies(filepath) then return next()

    if filter? and not filepath.match(new RegExp("^#{filter}")) then return next()

    extension = path.extname(filepath).substr(1)

    next()

    if filepath.match(/[\(\)]/)
      return console.log colors.red("Filename may not contain parentheses, please rename - \"#{filepath}\"")

    fileHandle = path.basename(filepath, '.html')

    page = _.find(pages, {handle: fileHandle})

    await fs.readFile(filepath, defer(err, fileContent))

    if page
      await helpers.shopifyRequest({
        filepath: filepath
        method: 'put'
        url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/pages/#{page.id}.json"
        json: {
          page: {
            id: page.id
            body_html: fileContent.toString('utf8')
          }
        }
      }, defer(err, res, assetsBody))
    else
      await helpers.shopifyRequest({
        filepath: filepath
        method: 'post'
        url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/pages.json"
        json: {
          page: {
            title: _.startCase(fileHandle)
            body_html: fileContent.toString('utf8')
            handle: fileHandle
          }
        }
      }, defer(err, res, assetsBody))
      console.log colors.yellow("Created new Page with handle #{fileHandle}...")

    unless err? then console.log colors.green("Uploaded #{filepath}")

  )
