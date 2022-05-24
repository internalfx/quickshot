
import context from '../context.js'

import actionUpload from './theme/upload.js'
import actionDownload from './theme/download.js'
import actionWatch from './theme/watch.js'

const HELPTEXT = `

    Quickshot theme ${context.VERSION}
    ==============================

    Commands:
      quickshot theme upload [options]              Upload theme files
      quickshot theme download [options]            Download theme files
      quickshot theme watch [options]               Watch theme folder, compile and synchronize changes automatically
      quickshot theme                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download/watch
      --filter=[filter]                             Filter files for upload/download
      --sync                                        Enable experimental two-way sync for watch

`

export default async function (argv) {
  const command = argv._.shift()

  const commands = {
    upload: actionUpload,
    download: actionDownload,
    watch: actionWatch,
  }

  if (commands[command] == null) {
    console.log(HELPTEXT)
  } else {
    return commands[command](argv)
  }
}
