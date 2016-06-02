
colors = require('colors')

HELPTEXT = """

          Quickshot products #{VERSION}
          ==============================

          Commands:
            quickshot products upload [options]              Upload products
            quickshot products download [options]            Download products
            quickshot products                               Show this screen.


          Options:
            --target=[targetname]                         Explicitly select target for upload/download

        """

exports.run = (argv) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)
  switch command
    when "download"
      await require('./products/download').run(argv, defer(err))
    when "upload"
      await require('./products/upload').run(argv, defer(err))
    else
      console.log HELPTEXT

  if err?
    console.log colors.red(err)

  process.exit()
