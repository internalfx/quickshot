
import _ from 'lodash'
import Promise from 'bluebird'
import { log, getTarget, mkdir, to } from '../../helpers.js'
import ignoreParser from 'gitignore-parser'
import path from 'path'
import fsp from 'fs/promises'
import requestify from '../../requestify.js'
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

  const res = await requestify(target, {
    method: `get`,
    url: `/themes/${target.theme_id}/assets.json`,
  })
  let assets = _.get(res, `body.assets`)

  if (ignore) {
    assets = _.reject(assets, function (asset) {
      return ignore.denies(`theme/${asset.key}`)
    })
  }

  if (filter) {
    assets = _.filter(assets, function (asset) {
      return filter.test(asset.key)
    })
  }

  await Promise.map(assets, async function (asset) {
    const res = await to(requestify(target, {
      method: `get`,
      url: `/themes/${target.theme_id}/assets.json`,
      qs: {
        'asset[key]': asset.key,
        theme_id: target.theme_id,
      },
    }))

    if (res.isError) {
      await log(res, `red`)
    } else {
      const data = _.get(res, `body.asset`)
      let rawData = null

      if (data.attachment) {
        rawData = Buffer.from(data.attachment, `base64`)
      } else if (data.value) {
        rawData = Buffer.from(data.value, `utf8`)
      }

      await mkdir(path.join(process.cwd(), `theme`, path.dirname(data.key)))
      await fsp.writeFile(path.join(process.cwd(), `theme`, data.key), rawData)

      total += 1
      await log(`Downloaded ${data.key}`, `green`)
    }
  }, { concurrency: config.concurrency })

  return `Downloaded ${total} files.`
}
