
colors = require('colors')

HELPTEXT = """

          Quickshot theme #{VERSION}
          ==============================

          Commands:
            quickshot theme upload [options] [filter]     Upload theme files, optionally providing a filter
            quickshot theme download [options] [filter]   Download theme files, optionally providing a filter
            quickshot theme watch [options]               Watch theme folder and synchronize changes automatically
            quickshot theme                               Show this screen.


          Options:
            --target=[targetname]                         Explicitly select target for upload/download/watch
            --sync                                        Transfer files synchronously for download

        """

exports.run = (argv) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)
  switch command
    when "download"
      await require('./theme/download').run(argv, defer(err))
    when "upload"
      await require('./theme/upload').run(argv, defer(err))
    when "watch"
      await require('./theme/watch').run(argv, defer(err))
    else
      console.log HELPTEXT

  if err?
    console.log colors.red(err)

  process.exit()
