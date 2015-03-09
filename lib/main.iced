
colors = require('colors')

HELPTEXT = """

              Quickshot #{VERSION}
              ==============================

              Commands:
                quickshot configure              Create a new configuration file in current directory
                quickshot download [filter]      Download theme files, optionally providing a filter
                quickshot upload [filter]        Upload theme files, optionally providing a filter
                quickshot watch                  Watch project folder and synchronize changes automatically
                quickshot --help                 Show this screen.

            """

exports.run = (argv) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)
  switch command
    when "configure"
      await require('./configure').run(argv, defer(err))
    when "download"
      await require('./download').run(argv, defer(err))
    when "upload"
      await require('./upload').run(argv, defer(err))
    when "watch"
      await require('./watch').run(argv, defer(err))
    else
      console.log HELPTEXT

  if err?
    console.log colors.red(err)

  process.exit()
