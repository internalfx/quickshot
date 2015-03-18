
fs = require('fs')
path = require('path')
cwd = process.cwd()
mfs = require('machinepack-fs')
request = require('request')
colors = require('colors')

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
    if err? then item.cb(err)
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
          cb(new Error("Shop configuration is from an older incompatible version of quickshot. You need to rename or delete your existing quickshot.json file and run 'quickshot configure' again."))
        cb(null, data)
    )

  shopifyRequest: (req, cb) ->
    shopifyQueue.add({req: req, cb: cb})

}
