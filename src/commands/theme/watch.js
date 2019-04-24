
let _ = require('lodash')
let Promise = require('bluebird')
let { log, getTarget, loadConfig } = require('../../helpers')
let ignoreParser = require('gitignore-parser')
let path = require('path')
let fs = require('fs')
Promise.promisifyAll(fs)
let requestify = require('../../requestify')
let chokidar = require('chokidar')
let sass = require('node-sass')

module.exports = async function (argv) {
  let ignore = null
  let config = await loadConfig()
  let target = await getTarget(config, argv)

  try {
    let ignoreFile = await fs.readFileAsync('.quickshot-ignore', 'utf8')
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  let watcher = chokidar.watch('./theme/', {
    ignored: /[/\\]\./,
    persistent: true,
    ignoreInitial: true,
    usePolling: true,
    interval: 300,
    binaryInterval: 300,
    cwd: process.cwd()
  })

  watcher.on('all', async function (event, filePath) {
    try {
      let pathParts = filePath.split(path.sep)
      let trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, 'theme') + 1))
      let key = trimmedParts.join(path.sep)
      let skipTransfer = false

      if (!filePath.match(/^theme/)) { return }
      if (filePath.match(/^\..*$/)) { return }
      if (filePath.match(/[()]/)) {
        log(`Filename may not contain parentheses, please rename - "${filePath}"`, 'red')
        return
      }

      if (ignore && ignore.denies(filePath)) {
        skipTransfer = true
        log(`IGNORING: ${filePath}`, 'yellow')
      }

      if (['add', 'change'].includes(event)) {
        if (config.compile_scss && filePath.match(/\.scss$/)) {
          let mainscss = config.primary_scss_file
          let targetscss = mainscss.replace('.scss', '.css')
          log(`Compiling Sass: "${mainscss}" -> "${targetscss}"`, 'yellow')
          let result = sass.renderSync({ file: mainscss, outFile: targetscss })
          await fs.writeFileAsync(targetscss, result.css)
        }

        // if (config.compile_babel && filePath.match(/\.(jsx|es6)$/)) {
        //   let sourceBabel = filePath
        //   let targetBabel = sourceBabel.replace(/\.(jsx|es6)$/, '.js')
        //   log(`Compiling Babel: "${sourceBabel}" -> "${targetBabel}"`, 'yellow')
        //   let sourceCode = yield fs.readFileAsync(sourceBabel, 'utf8')
        //   let compiledSource
        //   try {
        //     compiledSource = babel.transform(sourceCode, { presets: [babel_es2015, babel_react], plugins: [babel_umd] })
        //   } catch (err) {
        //     log(err, 'red')
        //   }
        //   if (compiledSource) {
        //     yield fs.writeFileAsync(targetBabel, compiledSource.code)
        //   }
        // }

        if (skipTransfer) { return }
        let data = await fs.readFileAsync(filePath)
        await requestify(target, {
          method: 'put',
          url: `/themes/${target.theme_id}/assets.json`,
          body: {
            asset: {
              key: key.split(path.sep).join('/'),
              attachment: data.toString('base64')
            }
          }
        })

        log(`Added/Updated ${filePath}`, 'green')
      } else if (event === 'unlink') {
        if (skipTransfer) { return }
        await requestify(target, {
          method: 'delete',
          url: `/themes/${target.theme_id}/assets.json?asset[key]=${key.split(path.sep).join('/')}`
        })

        log(`Deleted ${filePath}`, 'green')
      }
    } catch (err) {
      log(err, 'red')
    }
  })

  log('watching theme...', 'green')
}
