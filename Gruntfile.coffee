
module.exports = (grunt) ->

  grunt.initConfig(
    coffee: {
      compile: {
        expand: true
        flatten: true
        cwd: './lib'
        src: ['*.iced']
        dest: '.'
        ext: '.js'
      }
    }
  )

  grunt.loadNpmTasks('grunt-iced-coffee')

  grunt.registerTask('default', ['coffee'])
