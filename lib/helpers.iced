
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
      exponent = ((headroom * headroom) / 8)
      if exponent <= 0 then exponent = 1

      @throttle = 550 / exponent

      # console.log @throttle

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
      else
        console.log colors.red(res.statusCode)
        console.log colors.red(res.body)

}

module.exports = {

  loadConfig: (cb) ->
    configpath = path.join(cwd, 'quickshot.json')
    until config? or err?
      await
        callback = defer(err, config)
        mfs.readJson(
          source: configpath
          schema: {}
        ).exec(
          error: callback
          doesNotExist: ->
            callback()
          couldNotParse: ->
            callback(new Error("Shop configuration is corrupt, you may need to recreate your configuration"))
          success: (data) ->
            callback(null, data)
        )
      if config
        cb(null, config, path.dirname(configpath))
      else
        pathArr = configpath.split(path.sep)
        if (pathArr.length - 2) >= 0
          _.pullAt(pathArr, pathArr.length - 2);
        else
          return cb(new Error("Shop configuration is missing, have you run 'quickshot new shop'?"))
        configpath = '/'+path.join.apply(@, pathArr)

  shopifyRequest: (req, cb) ->
    shopifyQueue.add({req: req, cb: cb})

  isBinary: (extension) ->
    if _.includes(['gif', 'png', 'jpg', 'mp4', 'm4v', 'otf', 'eot', 'svg', 'ttf', 'woff', 'woff2'], extension)
      return true
    else
      return false

}
