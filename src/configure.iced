
helpers = require('./helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
mfs = require('machinepack-fs')
request = require('request')

exports.run = (argv, done) ->

  await helpers.loadConfig(defer(err, currConfig))
  config = currConfig or {}

  until configAction?.action is 'Save configuration and exit'

    await inquirer.prompt([
      {
        type: 'list'
        name: 'action'
        message: 'Main Menu'
        choices: [
          'Configure targets',
          'Configure scss',
          'Configure ignore file',
          'Save configuration and exit'
        ]
      }
    ], defer(configAction))

    switch configAction?.action
      when 'Configure targets'
        await configureTargets(config, defer(err, config))
      when 'Configure scss'
        await configureScss(config, defer(err, config))
      when 'Configure ignore file'
        await configureIgnoreFile(config, defer(err, config))

  config.configVersion = CONFIGVERSION

  mfs.writeJson(
    json: config
    destination: "quickshot.json"
    force: true
  ).exec(
    error: (err) ->
      console.log colors.red(err)
      return done()
    success: ->
      console.log colors.green("\nConfiguration saved!\n")
      return done()
  )



configureTargets = (config, cb) ->
  until targetAction?.action is 'Done Managing Targets'
    targetOpts = ['Create Target']
    if _.any(config.targets)
      targetOpts.push('Edit Target')
      targetOpts.push('Delete Target')
      targetOpts.push('List Targets')
      targetOpts.push('Done Managing Targets')

    await inquirer.prompt([
      {
        type: 'list'
        name: 'action'
        message: "Manage Targets"
        # default: 'Create Target'
        choices: targetOpts
      }
    ], defer(targetAction))

    targetChoices = _.map(config.targets, (target) -> "[#{target.target_name}] - '#{target.theme_name}' at #{target.domain}.myshopify.com")

    switch targetAction.action
      when 'Create Target', 'Edit Target'

        currTarget = {}
        editIndex = null

        if targetAction.action is 'Edit Target'
          await inquirer.prompt([
            {
              type: 'list'
              name: 'target'
              message: "Select target to edit"
              default: null
              choices: targetChoices
            }
          ], defer(editTarget))
          editIndex = _.indexOf(targetChoices, editTarget.target)
          currTarget = config.targets[editIndex]

        await inquirer.prompt([
          {
            type: 'input'
            name: 'target_name'
            message: "Enter a name for this target"
            default: (currTarget.target_name or null)
          }
          {
            type: 'input'
            name: 'api_key'
            message: "Shopify Private APP API key?"
            default: (currTarget.api_key or null)
          }
          {
            type: 'input'
            name: 'password'
            message: "Shopify Private APP Password?"
            default: (currTarget.password or null)
          }
          {
            type: 'input'
            name: 'domain'
            message: "Store URL?"
            default: (currTarget.domain or null)
          }
        ], defer(choices))

        currTarget.target_name = choices.target_name
        currTarget.api_key = choices.api_key
        currTarget.password = choices.password
        currTarget.domain = choices.domain.replace(new RegExp('^https?://'), '').replace(new RegExp('\.myshopify\.com.*'), '')

        await helpers.shopifyRequest({
          method: 'get'
          url: "https://#{currTarget.api_key}:#{currTarget.password}@#{currTarget.domain}.myshopify.com/admin/themes.json"
        }, defer(err, res, reqResult))

        themes = reqResult.themes
        defaultTheme = _.find(themes, {id: currTarget.theme_id})
        if defaultTheme then defaultTheme = "#{defaultTheme.name} (#{defaultTheme.role})"
        themeChoices = _.map(themes, (theme) -> "#{theme.name} (#{theme.role})")

        await inquirer.prompt([
          {
            type: 'list'
            name: 'theme'
            message: "Select theme"
            default: defaultTheme || null
            choices: themeChoices
          }
        ], defer(choices))

        theme = themes[_.indexOf(themeChoices, choices.theme)]
        currTarget.theme_name = theme.name
        currTarget.theme_id = theme.id

        if editIndex? and editIndex isnt -1
          config.targets[editIndex] = currTarget
          console.log colors.yellow("Target Modified!\n\n")
        else
          if _.isArray(config.targets)
            config.targets.push(currTarget)
          else
            config.targets = [currTarget]
          console.log colors.yellow("Target Created!\n\n")

      when 'Delete Target'
        await inquirer.prompt([
          {
            type: 'list'
            name: 'target'
            message: "Select target to delete"
            default: null
            choices: targetChoices
          }
        ], defer(deleteTarget))
        editIndex = _.indexOf(targetChoices, deleteTarget.target)
        _.pullAt(config.targets, editIndex)

      when 'List Targets'
        console.log ""
        for item in targetChoices
          console.log colors.cyan(item)
        console.log ""

  return cb(null, config)

configureScss = (config, cb) ->
  await inquirer.prompt([
    {
      type: 'confirm'
      name: 'compile_scss'
      message: "Would you like to enable automatic compiling for scss files?"
      default: config?.compile_scss || false
    }
  ], defer(choices))

  config.compile_scss = choices.compile_scss

  scss_warning = """
    You have enabled scss compiling.\n
    The filename entered below will be recompiled anytime ANY scss file changes while using 'quickshot watch'.
    The file will be created for you if it does not exist.
    You will want to put all your @import calls in that file.
    Then in your theme.liquid you will only need to include the compiled css file.\n
    See docs at https://github.com/internalfx/quickshot#autocompiling-scss for more information.
  """

  if config.compile_scss
    console.log colors.yellow(scss_warning)
    await inquirer.prompt([
      {
        type: 'input'
        name: 'primary_scss_file'
        message: "Enter relative path to primary scss file."
        default: config?.primary_scss_file || 'assets/application.scss'
      }
    ], defer(choices))
    config.primary_scss_file = choices.primary_scss_file
    await fs.readFile(config.primary_scss_file, defer(err, data))
    if err?
      notes = """
        //  Sass extends the CSS @import rule to allow it to import SCSS and Sass files. All imported SCSS
        //  and Sass files will be merged together into a single CSS output file.
        //  In addition, any variables or mixins defined in imported files can be used in the main file.
        //  Sass looks for other Sass files in the current directory, and the Sass file directory under Rack, Rails, or Merb.
        //  Additional search directories may be specified using the :load_paths option, or the --load-path option on the command line.
        //  @import takes a filename to import. By default, it looks for a Sass file to import directly,
        //  but there are a few circumstances under which it will compile to a CSS @import rule:

        //    If the file’s extension is .css.
        //    If the filename begins with http://.
        //    If the filename is a url().
        //    If the @import has any media queries.

        //  If none of the above conditions are met and the extension is .scss or .sass, then the named Sass or SCSS file will be imported.
        //  If there is no extension, Sass will try to find a file with that name and the .scss or .sass extension and import it.

        //  For example,
        //    @import "foo.scss";

        //  or
        //    @import "foo";
      """
      await fs.writeFile(config.primary_scss_file, notes, defer(err))

  return cb(null, config)


configureIgnoreFile = (config, cb) ->
  console.log colors.yellow("""

    You have two options for ignoring files in quickshot.
    You can use a '.gitignore' file which allows you to have all your ignores in one place.
    Or you can use a '.quickshotignore'. Which allows git and quickshot to ignore different files.

  """)
  await inquirer.prompt([
    {
      type: 'list'
      name: 'ignore_file'
      message: "What would you like to use as the quickshot ignore file?"
      default: config?.ignore_file || '.gitignore'
      choices: [
        '.gitignore'
        '.quickshotignore'
      ]
    }
  ], defer(choice))
  config.ignore_file = choice.ignore_file
  await fs.readFile(config.ignore_file, defer(err, data))
  if err?.code is 'ENOENT'
    if config.ignore_file is '.gitignore'
      notes = """
        # This your '#{config.ignore_file}' file. Anything you put in here will be ignored by quickshot and git.
      """
    else
      notes = """
        # This your '#{config.ignore_file}' file. Anything you put in here will be ignored by quickshot.
        # This file uses the same format as a '.gitignore' file.
      """
    await fs.writeFile(config.ignore_file, notes, defer(err))

  return cb(null, config)
