
import _ from 'lodash'
import Promise from 'bluebird'
import { log, getTarget, to } from '../../helpers.js'
import ignoreParser from 'gitignore-parser'
import path from 'path'
import fsp from 'fs/promises'
import requestify from '../../requestify.js'
import glob from 'glob'
import context from '../../context.js'

export default async function (argv) {
  let ignore = null
  const config = context.config
  const target = await getTarget(config, argv)

  let total = 0
  const filter = argv.filter ? new RegExp(`^${argv.filter}`) : null

  try {
    const ignoreFile = await fsp.readFile(`.quickshot-ignore`, `utf8`)
    ignore = ignoreParser.compile(ignoreFile)
  } catch (err) {}

  let files = glob.sync(`theme/**/*`, { nodir: true })

  if (ignore) {
    files = _.reject(files, function (file) {
      return ignore.denies(file)
    })
  }

  if (filter) {
    files = _.filter(files, function (file) {
      const pathParts = file.split(path.sep)
      const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, `theme`) + 1))
      const key = trimmedParts.join(`/`)
      return filter.test(key)
    })
  }

  files = files.map((file) => {
    const pathParts = file.split(path.sep)
    const trimmedParts = _.drop(pathParts, (_.lastIndexOf(pathParts, `theme`) + 1))
    const filepath = trimmedParts.join(path.sep)

    return {
      key: filepath,
      name: path.basename(filepath),
      path: file,
    }
  })

  await Promise.map(files, async function (file) {
    const body = await fsp.readFile(file.path)
    const res = await to(requestify(target, {
      method: `put`,
      url: `/themes/${target.theme_id}/assets.json`,
      body: {
        asset: {
          key: file.key,
          attachment: body.toString(`base64`),
        },
      },
    }))

    if (res.isError) {
      await log(res, `red`)
    } else {
      total += 1
      await log(`uploaded ${file.key}`, `green`)
    }
  }, { concurrency: config.concurrency })

  return `Uploaded ${total} files.`
}
