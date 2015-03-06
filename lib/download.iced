
_ = require('lodash')
inquirer = require("inquirer")
colors = require('colors')

# HELPTEXT = """
#
#               Quickshot Download
#               ==============================
#
#               Usage:
#                 quickshot download [options]
#
#               Options:
#                 --sh, --sourceHost=<host[:port]>    Source host, defaults to 'localhost:21015'
#                 --th, --targetHost=<host[:port]>    Target host, defaults to 'localhost:21015'
#                 --sd, --sourceDB=<dbName>           Source database
#                 --td, --targetDB=<dbName>           Target database
#
#                 --pt, --pickTables=<table1,table2>  Comma separated list of tables to copy (whitelist)
#                 --ot, --omitTables=<table1,table2>  Comma separated list of tables to ignore (blacklist)
#                                                     Note: '--pt' and '--ot' are mutually exclusive options.
#
#             """

HELPTEXT = """

              Quickshot Download
              ==============================

              Usage:
                quickshot download [options]

            """

exports.run = (argv, done) ->
  sHost = argv.sh ?= if argv.sourceHost then argv.sourceHost else 'localhost:28015'
  tHost = argv.th ?= if argv.targetHost then argv.targetHost else 'localhost:28015'
  sourceHost = _.first(sHost.split(':'))
  targetHost = _.first(tHost.split(':'))
  sourcePort = Number(_.last(sHost.split(':'))) or 28015
  targetPort = Number(_.last(tHost.split(':'))) or 28015
  sourceDB = argv.sd ?= if argv.sourceDB then argv.sourceDB else null
  targetDB = argv.td ?= if argv.targetDB then argv.targetDB else null
  pickTables = argv.pt ?= if argv.pickTables then argv.pickTables else null
  omitTables = argv.ot ?= if argv.omitTables then argv.omitTables else null

  pickTables = pickTables.split(',') if pickTables?
  omitTables = omitTables.split(',') if omitTables?

  if argv.h or argv.help
    console.log HELPTEXT
    return done()

  if pickTables? and omitTables?
    console.log "pickTables and omitTables are mutually exclusive options."
    return done()

  unless sourceDB? and targetDB?
    console.log "Source and target databases are required!"
    console.log HELPTEXT
    return done()

  if "#{sourceHost}:#{sourcePort}" is "#{targetHost}:#{targetPort}" and sourceDB is targetDB
    console.log "Source and target databases must be different if cloning on same server!"
    return done()

  unless _.contains(dbList, sourceDB)
    console.log "Source DB does not exist!"
    return done()

  if pickTables? and !_.every(pickTables, (table)-> _.contains(sourceTableList, table))
    console.log colors.red("Not all the tables specified in --pickTables exist!")
    return done()

  if omitTables? and !_.every(omitTables, (table)-> _.contains(sourceTableList, table))
    console.log colors.red("Not all the tables specified in --omitTables exist!")
    return done()

  directClone = "#{sourceHost}:#{sourcePort}" is "#{targetHost}:#{targetPort}"

  await
    confMessage = """#{colors.green("Ready to clone!")}
      The database '#{colors.yellow("#{sourceDB}")}' on '#{colors.yellow("#{sourceHost}")}:#{colors.yellow("#{sourcePort}")}' will be cloned to the '#{colors.yellow("#{targetDB}")}' database on '#{colors.yellow("#{targetHost}")}:#{colors.yellow("#{targetPort}")}'
      This will destroy(drop & create) the '#{colors.yellow("#{targetDB}")}' database on '#{colors.yellow("#{targetHost}")}:#{colors.yellow("#{targetPort}")}' if it exists!\n"""
    if pickTables?
      confMessage += "ONLY the following tables will be copied: #{colors.yellow("#{pickTables.join(',')}")}\n"
    if omitTables?
      confMessage += "The following tables will NOT be copied: #{colors.yellow("#{omitTables.join(',')}")}\n"
    if directClone
      confMessage += "Source RethinkDB Server is same as target. Cloning locally on server(this is faster)."
    else
      confMessage += "Source and target databases are on different servers. Cloning over network."

    console.log confMessage
    inquirer.prompt([{
      type: 'confirm'
      name: 'confirmed'
      message: "Proceed?"
      default: false
    }], defer(answer))

  unless answer.confirmed
    console.log colors.red("ABORT!")
    return done()
