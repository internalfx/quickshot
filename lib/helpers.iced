
fs = require('fs')

module.exports = {

  loadConfig: (cb) ->
    await fs.readFile('./config.json', defer(err, config))
    if err? then cb(err)
    cb(null, JSON.parse(config))

  saveConfig: (config, cb) ->
    await fs.writeFile('./config.json', JSON.stringify(config), defer(err))
    if err? then cb(err)
    cb(null)

}
