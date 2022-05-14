
import context from '../context.js'

import actionUpload from './products/upload.js'
import actionDownload from './products/download.js'

var HELPTEXT = `

    Quickshot products ${context.VERSION}
    ==============================

    Commands:
      quickshot products upload [options]              Upload products
      quickshot products download [options]            Download products
      quickshot products                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download

`

export default async function (argv) {
  const command = argv._.shift()

  const commands = {
    upload: actionUpload,
    download: actionDownload,
  }

  if (commands[command] == null) {
    console.log(HELPTEXT)
  } else {
    return commands[command](argv)
  }
}
