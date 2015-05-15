
fs = require('fs')
path = require('path')
mfs = require('machinepack-fs')
request = require('request')
colors = require('colors')
inquirer = require("inquirer")

shopifyQueue = {
  isRunning: false
  throttle: 0
  inFlight: 0
  rate: 0
  max: 40
  queue: []

  add: (item) ->
    @queue.push(item)
    unless @isRunning
      @run()

  retry: (item) ->
    @queue.unshift(item)
    unless @isRunning
      @run()

  run: ->
    @isRunning = true
    while @queue.length > 0
      headroom = @max - (@rate + @inFlight)
      if headroom <= 0 then headroom = 0
      exponent = ((headroom * headroom) / 9)
      if exponent <= 0 then exponent = 1

      @throttle = 500 / exponent

      await setTimeout(defer(), @throttle)
      @request(@queue.shift())
    @isRunning = false

  request: (item) ->
    @inFlight += 1
    await request(item.req, defer(err, res, body))
    @inFlight -= 1
    if err? then return item.cb(err)
    switch res.statusCode
      when 200, 201
        try body = JSON.parse(body)

        if body.errors
          console.log colors.red(body.errors)
          @retry(item)
        else
          limit = res.headers['x-shopify-shop-api-call-limit']
          limit = limit.split('/')
          @rate = parseInt(_.first(limit))
          @max = parseInt(_.last(limit))

          item.cb(null, res, body)
      when 429
        @retry(item)
      when 422
        try body = JSON.parse(body)
        if _.isArray(body?.errors?.asset)
          for error in body.errors.asset
            console.log colors.red("Error in #{item.req.filepath} - #{error}")
      else
        console.log colors.red("Failed to transfer [#{res.statusCode}] #{item.req.filepath}")

}

module.exports = {

  loadConfig: (cb) ->
    mfs.readJson(
      source: 'quickshot.json'
      schema: {}
    ).exec(
      error: cb
      doesNotExist: ->
        cb(new Error("Shop configuration is missing, have you run 'quickshot configure'?"))
      couldNotParse: ->
        cb(new Error("Shop configuration is corrupt, you may need to delete 'quickshot.json', and run 'quickshot configure' again."))
      success: (data) ->
        if !data.configVersion? or data.configVersion < CONFIGVERSION
          cb(new Error("Shop configuration is from an older incompatible version of quickshot. You need to run 'quickshot configure' again."))
        cb(null, data)
    )

  shopifyRequest: (req, cb) ->
    shopifyQueue.add({req: req, cb: cb})

  getTarget: (config, argv, cb) ->
    if argv['target']
      targetName = argv['target']

    target = null
    if _.isArray(config.targets)
      if targetName
        target = _.find(config.targets, {target_name: targetName})
        if target
          return cb(null, target)
        else
          return cb(new Error("Could not find target '#{targetName}'"))
      else
        targetChoices = _.map(config.targets, (target) -> "[#{target.target_name}] - '#{target.theme_name}' at #{target.domain}.myshopify.com")
        if config.targets.length > 1
          await inquirer.prompt([
            {
              type: 'list'
              name: 'target'
              message: "Select target"
              default: null
              choices: targetChoices
            }
          ], defer(choice))
          target = config.targets[_.indexOf(targetChoices, choice.target)]
        else if config.targets.length is 1
          target = _.first(config.targets)
        return cb(null, target)
    else
      return cb(new Error("No targets configured! Run 'quickshot configure' and create a new target."))

  getShopPages: (target, cb) ->
    chunkSize = 250
    page = 1
    pages = []
    pagesBody = {
      pages: [0]
    }

    while pagesBody.pages.length isnt 0
      await @shopifyRequest({
        method: 'get'
        url: "https://#{target.api_key}:#{target.password}@#{target.domain}.myshopify.com/admin/pages.json?limit=#{chunkSize}&page=#{page}"
      }, defer(err, res, pagesBody))
      if err? then return cb(err)

      pages = pages.concat(pagesBody.pages)
      page += 1

    return cb(null, pages)


}
