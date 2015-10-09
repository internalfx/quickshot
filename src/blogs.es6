
import colors from 'colors'
import _ from 'lodash'
import Download from './blogs/download'

var HELPTEXT = `

    Quickshot blogs ${VERSION}
    ==============================

    Commands:
      quickshot blogs upload [options] [filter]     Upload blogs files, optionally providing a filter
      quickshot blogs download [options] [filter]   Download blogs files, optionally providing a filter
      quickshot blogs                               Show this screen.


    Options:
      --target=[targetname]                         Explicitly select target for upload/download

`

var run = function (argv) {
  var command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)
  var funcTarget = null
  if (command === 'download') {
    funcTarget = Download
  } else if (command === 'upload') {
    // funcTarget = Upload
  } else {
    console.log(HELPTEXT)
  }

  if (funcTarget != null) {
    funcTarget(argv)
    .then(function (result) {
      console.log(colors.green(result))
    })
    .catch(function (err) {
      console.log(colors.red(err))
    })
  }
}

export default run
