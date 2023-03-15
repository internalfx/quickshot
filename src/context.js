
import { fileURLToPath } from 'url'
import path from 'path'
import fsp from 'fs/promises'
const filename = fileURLToPath(import.meta.url)
const appDir = path.join(path.dirname(filename), `..`)
const pjson = JSON.parse(await fsp.readFile(path.join(appDir, `./package.json`), `utf8`))

const context = {
  initialized: false,
  configVersion: 3,
  apiVersion: `2023-01`,
  config: {},
  appDir: appDir,
  VERSION: pjson.version,
}

export default context
