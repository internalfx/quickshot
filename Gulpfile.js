'use strict'

// var _ = require('lodash')
var gulp = require('gulp')
var iced = require('gulp-iced-coffee')
// var del = require('del')
// var sass = require('gulp-sass')
// var concat = require('gulp-concat-util')
// var gutil = require('gulp-util')
// var gulpif = require('gulp-if')
// var watch = require('gulp-watch')
//
// var webpack = require('webpack')
// var WebpackDevServer = require('webpack-dev-server')
//
// var wpConf = require('./webpack.config.js')

var scripts = [
  'src/**/*.iced'
]

gulp.task('default', ['iced-coffee'], function () {
  return true
})

gulp.task('iced-coffee', [], function () {
  gulp.src(scripts)
  .pipe(iced({expand: true}))
  .pipe(gulp.dest('lib/'))
})
