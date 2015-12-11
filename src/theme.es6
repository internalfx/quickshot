
import co from 'co'
import colors from 'colors'
import _ from 'lodash'

import Download from './theme/download'
import Upload from './theme/upload'
import Watch from './theme/watch'

var HELPTEXT = `

    Quickshot theme ${VERSION}
    ==============================

    Commands:
      quickshot theme upload [options] [filter]     Upload theme files, optionally providing a filter
      quickshot theme download [options] [filter]   Download theme files, optionally providing a filter
      quickshot theme watch [options]               Watch theme folder and synchronize changes automatically
      quickshot theme                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download/watch
      --sync                                        Transfer files synchronously for upload/download

`

var run = function *(argv) {
  var command = _.first(argv['_'])
  argv['_'] = argv['_'].slice(1)

  var result = null

  if (command === 'download') {
    result = yield Download(argv)
  } else if (command === 'upload') {
    result = yield Upload(argv)
  } else if (command === 'watch') {
    result = yield Watch(argv)
  } else {
    console.log(HELPTEXT)
  }

  return result
}

export default run
