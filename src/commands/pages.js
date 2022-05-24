
import context from '../context.js'

import actionUpload from './pages/upload.js'
import actionDownload from './pages/download.js'

const HELPTEXT = `

    Quickshot pages ${context.VERSION}
    ==============================

    Commands:
      quickshot pages upload [options]              Upload pages
      quickshot pages download [options]            Download pages
      quickshot pages                               Show this screen.

    Options:
      --target=[targetname]                         Explicitly select target for upload/download
      --filter=[filter]                             Filter files for upload

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
