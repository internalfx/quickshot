
fs = require('fs')
path = require('path')
cwd = process.cwd()
mfs = require('machinepack-fs')
request = require('request')

shopifyQueue = {
  isRunning: false
  throttle: 0
  inFlight: 0
  rate: 0
  max: 10
  queue: []

  add: (item) ->
    @queue.push(item)
    unless @isRunning
      @run()

  run: ->
    @isRunning = true
    while @queue.length > 0
      headroom = @max - (@rate + @inFlight)
      exponent = ((headroom * headroom) / 16)
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

    limit = res.headers['x-shopify-shop-api-call-limit']
    limit = limit.split('/')
    @rate = parseInt(_.first(limit))
    @max = parseInt(_.last(limit))

    body = JSON.parse(body)
    item.cb(null, body)
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
        cb(null, config)
      else
        pathArr = configpath.split(path.sep)
        if (pathArr.length - 2) >= 0
          _.pullAt(pathArr, pathArr.length - 2);
        else
          return cb(new Error("Shop configuration is missing, have you run 'quickshot new shop'?"))
        configpath = '/'+path.join.apply(@, pathArr)

  saveConfig: (config, cb) ->
    await fs.writeFile('./quickshot.json', JSON.stringify(config), defer(err))
    if err? then cb(err)
    cb(null)

  shopifyRequest: (req, cb) ->
    shopifyQueue.add({req: req, cb: cb})

}
