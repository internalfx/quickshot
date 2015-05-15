
colors = require('colors')

HELPTEXT = """

          Quickshot pages #{VERSION}
          ==============================

          Commands:
            quickshot pages upload [options] [filter]     Upload pages files, optionally providing a filter
            quickshot pages download [options] [filter]   Download pages files, optionally providing a filter
            quickshot pages watch [options]               Watch pages folder and synchronize changes automatically
            quickshot pages                               Show this screen.


          Options:
            --target=[targetname]                         Explicitly select target for upload/download/watch

        """

exports.run = (argv) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)
  switch command
    when "download"
      await require('./pages/download').run(argv, defer(err))
    when "upload"
      await require('./pages/upload').run(argv, defer(err))
    when "watch"
      await require('./pages/watch').run(argv, defer(err))
    else
      console.log HELPTEXT

  if err?
    console.log colors.red(err)

  process.exit()
