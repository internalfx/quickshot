
let Promise = require('bluebird')
let { log } = require('../../helpers')
let path = require('path')
let fs = require('fs')
Promise.promisifyAll(fs)
let inquirer = Promise.promisifyAll(require('inquirer'))

let scssWarning = `
  You have enabled scss compiling.\n
  The filename entered below will be recompiled anytime ANY scss file changes while using 'quickshot theme watch'.
  The file will be created for you if it does not exist.
  You will want to put all your @import calls in that file.
  Then in your theme.liquid you will only need to include the compiled css file.\n
  See docs at http://quickshot.io/scss.html for more information.
`

let defaultFile = `
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
`

module.exports = async function (config) {
  let choice

  choice = await inquirer.prompt([{
    type: 'confirm',
    name: 'compile_scss',
    message: 'Would you like to enable automatic compiling for scss files?',
    default: config.compile_scss
  }])
  config.compile_scss = choice.compile_scss

  if (config.compile_scss) {
    log(scssWarning, 'yellow')

    choice = await inquirer.prompt([{
      type: 'input',
      name: 'primary_scss_file',
      message: 'Enter relative path to primary scss file. \n e.g. theme/assets/application.css',
      default: config.primary_scss_file || path.join('theme', 'assets', 'application.scss')
    }])
    config.primary_scss_file = choice.primary_scss_file

    try {
      await fs.statAsync(config.primary_scss_file)
    } catch (err) {
      await fs.mkdirAsync(path.join(process.cwd(), 'theme', 'assets'), { recursive: true })
      await fs.writeFileAsync(config.primary_scss_file, defaultFile)
    }
  }

  return config
}
