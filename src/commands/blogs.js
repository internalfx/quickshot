
import context from '../context.js'

import actionUpload from './blogs/upload.js'
import actionDownload from './blogs/download.js'

const HELPTEXT = `

    Quickshot blogs ${context.VERSION}
    ==============================

    Commands:
      quickshot blogs upload [options]              Upload blogs
      quickshot blogs download [options]            Download blogs
      quickshot blogs                               Show this screen.

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
