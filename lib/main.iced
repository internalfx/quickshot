
_ = require('lodash')
config = require('config')

HELPTEXT = """

              Quickshot #{VERSION}
              ==============================

              Commands:
                quickshot config
                quickshot download
                quickshot --help        Show this screen.

            """

# Some notes --> process.stdout.write(" RECORDS INSERTED: Total = #{records_processed} | Per Second = #{rps} | Percent Complete = %#{pc}          \r");

exports.run = (argv) ->
  command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)
  switch command
    when "config"
      await require('./config').run(argv, defer())
    when "download"
      await require('./download').run(argv, defer())
    else
      console.log HELPTEXT

  process.exit()
