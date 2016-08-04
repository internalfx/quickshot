
let _ = require('lodash')
let { log, getTarget, loadConfig } = require('../helpers')
let parser = require('gitignore-parser')
let path = require('path')
let fs = require('fs')
fs.mkdirp = require('mkdirp')
Promise.promisifyAll(fs)
// let asyncEach = require('../asyncEach')
let requestify = require('../requestify')
let co = require('co')
let chokidar = require('chokidar')
let sass = require('node-sass')

let babel = require('babel-core')
let babel_es2015 = require('babel-preset-es2015')
let babel_react = require('babel-preset-react')
let babel_umd = require('babel-plugin-transform-es2015-modules-umd')

module.exports = function *(argv) {
  var ignore = null
  let config = yield loadConfig()
  let target = yield getTarget(config, argv)

  if (config.ignore_file) {
    ignore = parser.compile(yield fs.readFileAsync(config.ignore_file, 'utf8'))
  }

  let watcher = chokidar.watch('./theme/', {
    ignored: /[\/\\]\./,
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
    interval: 300,
    binaryInterval: 300,
    cwd: process.cwd()
  })

  watcher.on('all', function (event, filePath) {
    return co(function *() {
      let pathParts = filePath.split(path.sep)
      let trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, 'theme') + 1))
      let key = trimmedParts.join(path.sep)

      if (!filePath.match(/^theme/)) { return }
      if (filePath.match(/^\..*$/)) { return }
      if (filePath.match(/[\(\)]/)) {
        log(`Filename may not contain parentheses, please rename - "${filePath}"`, 'red')
        return
      }
      if (ignore && ignore.denies(filePath)) {
        log(`IGNORING: ${filePath}`, 'yellow')
        return
      }

      if (['add', 'change'].includes(event)) {
        if (config.compile_scss && filePath.match(/\.scss$/)) {
          let mainscss = config.primary_scss_file
          let targetscss = mainscss.replace('.scss', '.css.liquid')
          log(`Compiling Sass: "${mainscss}" -> "${targetscss}"`, 'yellow')
          let result = sass.renderSync({file: mainscss, outFile: targetscss})
          yield fs.writeFileAsync(targetscss, result.css)
        }

        if (config.compile_babel && filePath.match(/\.(jsx|es6)$/)) {
          let sourceBabel = filePath
          let targetBabel = sourceBabel.replace(/\.(jsx|es6)$/, '.js')
          log(`Compiling Babel: "${sourceBabel}" -> "${targetBabel}"`, 'yellow')
          let sourceCode = yield fs.readFileAsync(sourceBabel, 'utf8')
          let compiledSource
          try {
            compiledSource = babel.transform(sourceCode, {presets: [babel_es2015, babel_react], plugins: [babel_umd]})
          } catch (err) {
            log(err, 'red')
          }
          if (compiledSource) {
            yield fs.writeFileAsync(targetBabel, compiledSource.code)
          }
        }

        let data = yield fs.readFileAsync(filePath)
        yield requestify(target, {
          method: 'put',
          url: `/admin/themes/${target.theme_id}/assets.json`,
          data: {
            asset: {
              key: key.split(path.sep).join('/'),
              attachment: data.toString('base64')
            }
          }
        })

        log(`Added/Updated ${filePath}`, 'green')
      } else if (event === 'unlink') {
        yield requestify(target, {
          method: 'delete',
          url: `/admin/themes/${target.theme_id}/assets.json?asset[key]=${key.split(path.sep).join('/')}`
        })

        log(`Deleted ${filePath}`, 'green')
      }
    }).catch((err) => {
      log(err.stack, 'red')
    })
  })

  log('watching theme...', 'green')
}
