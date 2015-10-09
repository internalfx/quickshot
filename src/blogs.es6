
import colors from 'colors'
import _ from 'lodash'
import Download from './blogs/download'

var HELPTEXT = `

          Quickshot pages #{VERSION}
          ==============================

          Commands:
            quickshot pages upload [options] [filter]     Upload pages files, optionally providing a filter
            quickshot pages download [options] [filter]   Download pages files, optionally providing a filter
            quickshot pages watch [options]               Watch pages folder and synchronize changes automatically
            quickshot pages                               Show this screen.


          Options:
            --target=[targetname]                         Explicitly select target for upload/download/watch

`

var run = function (argv) {
  var command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)
  if (command === 'download') {
    Download(argv)
  } else if (command === 'upload') {
    // require('./pages/upload').run(argv)
  } else {
    console.log(HELPTEXT)
  }

  // if (err != null) {
  //   console.log(colors.red(err))
  // }

  process.exit()
}

export default run
