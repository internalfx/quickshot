
_ = require('lodash')
colors = require('colors')

HELPTEXT = """

              Quickshot #{VERSION}
              ==============================

              Commands:
                quickshot new
                quickshot download
                quickshot list
                quickshot --help        Show this screen.

            """

# Some notes --> process.stdout.write(" RECORDS INSERTED: Total = #{records_processed} | Per Second = #{rps} | Percent Complete = %#{pc}          \r");

exports.run = (argv) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)
  switch command
    when "new"
      await require('./new').run(argv, defer(err))
    when "download"
      await require('./download').run(argv, defer(err))
    when "list"
      await require('./list').run(argv, defer(err))
    else
      console.log HELPTEXT

  if err?
    console.log colors.red(err)

  process.exit()
