
fs = require('fs')
path = require('path')
cwd = process.cwd()
mfs = require('machinepack-fs')

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

}
