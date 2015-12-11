
// var helpers = require('../helpers')
//
// var _ = require('lodash')
// var inquirer = require("inquirer")
// var colors = require('colors')
// var fs = require('fs')
// var path = require('path')
// var request = require('request')
// var mkdirp = require('mkdirp')
// var walk = require('walk')
// var parser = require('gitignore-parser')

import _ from 'lodash'
import co from 'co'
import * as helpers from '../helpers'
import parser from 'gitignore-parser'
import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
Promise.promisifyAll(fs)

var run = function *(argv) {
  var filter = _.first(argv['_'])
  var ignore = null

  var config = yield helpers.loadConfig()

  if (config.ignore_file) {
    ignore = parser.compile(yield fs.readFileAsync(config.ignore_file, 'utf8'))
  }

  var target = yield helpers.getTarget(config, argv)

  var files = yield helpers.listFiles('theme')

  var fileProcesses = files.reduce(function (list, file) {
    let pathParts = file.split(path.sep)
    let trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, 'theme') + 1))
    let filepath = trimmedParts.join(path.sep)
    let filename = path.basename(filepath)

    // Ignore hidden files
    if (filename.match(/^\..*$/)) { return list }

    // Ignore paths configured in ignore file
    if (ignore && ignore.denies(filepath)) { return list }

    if (filter && !filepath.match(new RegExp(`^${filter}`))) { return list }

    list.push(co(function *() {
      var data = yield fs.readFileAsync(path.join('theme', filepath))

      var cleanPath = filepath.split(path.sep).join('/')

      yield helpers.shopifyRequest({
        name: cleanPath,
        request: {
          method: 'put',
          url: `https://${target.domain}.myshopify.com/admin/themes/${target.theme_id}/assets.json`,
          headers: {'Authorization': target.auth},
          data: {
            asset: {
              key: cleanPath,
              attachment: data.toString('base64')
            }
          }
        }
      })

      helpers.log(`uploaded ${cleanPath}`, 'green')
    }))

    return list
  }, [])

  yield Promise.all(fileProcesses)

  return 'Done!'
}

export default run
