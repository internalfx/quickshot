
helpers = require('./helpers')

inquirer = require("inquirer")
colors = require('colors')
fs = require('fs')
mfs = require('machinepack-fs')
request = require('request')

exports.run = (argv, done) ->

  await helpers.loadConfig(defer(err, currConfig, projDir))

  await inquirer.prompt([
    {
      type: 'input'
      name: 'api_key'
      message: "Shopify Private APP API key?"
      default: currConfig?.api_key || null
    }
    {
      type: 'input'
      name: 'password'
      message: "Shopify Private APP Password?"
      default: currConfig?.password || null
    }
    {
      type: 'input'
      name: 'domain'
      message: "Store URL?"
      default: currConfig?.domain || null
    }
  ], defer(config))

  domain = config.domain
  domain = domain.replace(new RegExp('^https?://'), '')
  domain = domain.replace(new RegExp('\.myshopify\.com.*'), '')
  config.domain = domain

  console.log colors.green("\nShop credentials set! Fetching themes...\n")
  await request({
    method: 'get'
    url: "https://#{config.api_key}:#{config.password}@#{config.domain}.myshopify.com/admin/themes.json"
  }, defer(err, res, body))
  if err? then done(err)

  themes = JSON.parse(body).themes

  await inquirer.prompt([
    {
      type: 'list'
      name: 'theme'
      message: "Select theme"
      default: _.find(themes, {id: currConfig?.theme_id})?.name || null
      choices: _.map(themes, (theme) -> theme.name)
    }
    {
      type: 'confirm'
      name: 'compile_sass'
      message: "Would you like to enable automatic compiling for scss files?"
      default: currConfig?.compile_sass || false
    }
  ], defer(choices))

  theme = _.find(themes, {name: choices.theme})
  config.theme_id = theme.id
  config.compile_sass = choices.compile_sass

  scss_warning = """
    You have enabled scss compiling.\n
    The filename entered below will be recompiled anytime ANY scss file changes while using 'quickshot watch'.
    The file will be created for you if it does not exist.
    You will want to put all your @import calls in that file.
    Then in your theme.liquid you will only need to include the compiled css file.\n
    See docs at https://github.com/internalfx/quickshot#autocompiling-scss for more information.
  """

  if config.compile_sass
    console.log colors.yellow(scss_warning)
    await inquirer.prompt([
      {
        type: 'input'
        name: 'primary_scss_file'
        message: "Enter relative path to primary scss file."
        default: currConfig?.primary_scss_file || 'assets/application.scss'
        choices: _.map(themes, (theme) -> theme.name)
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
