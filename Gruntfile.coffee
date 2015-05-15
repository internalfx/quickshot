
module.exports = (grunt) ->

  grunt.initConfig(
    coffee: {
      compile: {
        expand: true
        flatten: true
        cwd: './src'
        src: ['*.iced']
        dest: './lib'
        ext: '.js'
      }
    }
  )

  grunt.loadNpmTasks('grunt-iced-coffee')

  grunt.registerTask('default', ['coffee'])
