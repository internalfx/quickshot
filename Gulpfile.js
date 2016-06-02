'use strict'

// var _ = require('lodash')
var gulp = require('gulp')
var iced = require('gulp-iced-coffee')
var babel = require('gulp-babel')
var watch = require('gulp-watch')

var coffeeScripts = 'src/**/*.iced'
var babelScripts = 'src/**/*.es6'

gulp.task('default', [
  'coffee',
  'babel'
], function () {
  return true
})

gulp.task('dev', [
  'coffee',
  'coffee-watch',
  'babel',
  'babel-watch'
], function () {
  return true
})

gulp.task('coffee', [], function () {
  gulp.src(coffeeScripts)
  .pipe(iced({expand: true}))
  .pipe(gulp.dest('lib/'))
})

gulp.task('coffee-watch', [], function () {
  gulp.watch(coffeeScripts, ['coffee'])
})

gulp.task('babel', [], function () {
  gulp.src(babelScripts)
  .pipe(babel({
    sourceMaps: 'inline'
  }))
  .pipe(gulp.dest('lib/'))
})

gulp.task('babel-watch', [], function () {
  gulp.watch(babelScripts, ['babel'])
})
