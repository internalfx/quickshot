
import _ from 'lodash'
import path from 'path'
import fsp from 'fs/promises'
import colors from 'colors'
import inquirer from 'inquirer'
import moment from 'moment'
import context from './context.js'

export const stringify = function (data) {
  return JSON.stringify(data, null, 2)
}

export const loadConfig = async function (spec = {}) {
  let config
  const { ignoreVersion } = spec

  try {
    config = await fsp.readFile(path.join(process.cwd(), `quickshot.json`), `utf8`)
  } catch (err) {
    throw new Error(`Shop configuration is missing, have you run 'quickshot configure'?`)
  }

  try {
    config = JSON.parse(config)
  } catch (err) {
    throw new Error(`Shop configuration is corrupt, you may need to delete 'quickshot.json', and run 'quickshot config' again.`)
  }

  if (ignoreVersion !== true) {
    if (!config.configVersion || config.configVersion < context.configVersion) {
      throw new Error(`Shop configuration is from an older version of quickshot. You need to run 'quickshot config' again.`)
    }
  }

  Object.assign(context.config, config)

  return config
}

export const getTarget = async function (config, argv) {
  const targetName = argv.target || null

  let target = null
  if (_.isArray(config.targets)) {
    if (targetName) {
      target = _.find(config.targets, { name: targetName })
      if (!target) {
        throw new Error(`Could not find target '${targetName}'`)
      }
    } else {
      const targetChoices = config.targets.map(function (target) {
        const urlObj = new URL(target.url)
        return `[${target.name}] - '${target.theme_name}' @ ${urlObj.host}`
      })
      if (config.targets.length > 1) {
        const choice = await inquirer.prompt([
          {
            type: `list`,
            name: `target`,
            message: `Select target`,
            default: null,
            choices: targetChoices,
          },
        ])
        target = config.targets[_.indexOf(targetChoices, choice.target)]
      } else if (config.targets.length === 1) {
        target = _.first(config.targets)
      }
    }
  } else {
    throw new Error(`No targets configured! Run 'quickshot configure' and create a new target.`)
  }

  // target.auth = 'Basic ' + new Buffer(`${target.api_key}:${target.password}`).toString('base64')
  return target
}

export const ts = function () {
  return moment().format(`hh:mm:ss a`)
}

export const log = async function (content, color = `white`) {
  let data = null
  let message = null
  const logToFile = _.get(context, `config.enableLogfile`) || false

  if (_.isError(content)) {
    message = content
    data = content
  } else if (_.isObject(content)) {
    if (content.message) {
      message = content.message
    }
    if (content.data) {
      data = content.data
    } else {
      data = content
    }
  } else {
    message = content
  }

  if (message) {
    console.log(colors[color](`${ts()} - ${message}`))
    if (logToFile === true) {
      try {
        await fsp.appendFile(path.join(process.cwd(), `quickshot.log`), `${ts()} - ${message}\n`, `utf8`)
      } catch (err) {
        await log(err)
      }
    }
  }

  if (data) {
    console.log(colors[color](`=== START OF OUTPUT ===`))
    console.dir(data, { depth: null })
    console.log(colors[color](`==== END OF OUTPUT ====`))
    if (logToFile === true) {
      try {
        await fsp.appendFile(path.join(process.cwd(), `quickshot.log`), `=== START OF OUTPUT ===\n`, `utf8`)
        await fsp.appendFile(path.join(process.cwd(), `quickshot.log`), `${stringify(data)}\n`, `utf8`)
        await fsp.appendFile(path.join(process.cwd(), `quickshot.log`), `=== END OF OUTPUT ===\n`, `utf8`)
      } catch (err) {
        await log(err)
      }
    }
  }
}

export const to = function (promise) {
  return promise.then(function (val) {
    return val
  }).catch(function (err) {
    err.isError = true
    return err
  })
}

export const mkdir = async function (path) {
  try {
    await fsp.mkdir(path, { recursive: true })
  } catch (err) {
    if (err.code !== `EEXIST`) {
      throw err
    }
  }
}

export const FRONT_MATTER_START = `<!--START-FRONT-MATTER`
export const FRONT_MATTER_END = `END-FRONT-MATTER-->`

export const stringifyArticle = function (article) {
  const frontMatter = stringify(_.omit(article, `body_html`, `id`))
  const res = []
  res.push(FRONT_MATTER_START)
  res.push(frontMatter)
  res.push(FRONT_MATTER_END)
  res.push(article.body_html)
  return res.join(`\n`)
}

export const parseArticle = function (source) {
  let [frontMatter, body] = source.split(FRONT_MATTER_END)
  frontMatter = frontMatter.replace(FRONT_MATTER_START, ``)
  const data = JSON.parse(frontMatter)
  data.body_html = body.trim()
  return data
}

export const parseBlog = function (source) {
  const data = JSON.parse(source)
  return data
}

export const stringifyPage = function (page) {
  const frontMatter = stringify(_.omit(page, `body_html`, `id`))
  const res = []
  res.push(FRONT_MATTER_START)
  res.push(frontMatter)
  res.push(FRONT_MATTER_END)
  res.push(page.body_html)
  return res.join(`\n`)
}

export const parsePage = function (source) {
  let [frontMatter, body] = source.split(FRONT_MATTER_END)
  frontMatter = frontMatter.replace(FRONT_MATTER_START, ``)
  const data = JSON.parse(frontMatter)
  data.body_html = body.trim()
  return data
}

export const stringifyProduct = function (product) {
  delete product.image
  delete product.options

  if (_.get(product, `images`)) {
    product.images = product.images.map(function (image) {
      return _.pick(image, `src`)
    })
  }

  if (_.get(product, `variants`)) {
    product.variants = product.variants.map(function (variant) {
      return _.omit(variant, `id`, `product_id`, `inventory_item_id`, `admin_graphql_api_id`, `image_id`)
    })
  }

  const frontMatter = stringify(_.omit(product, `body_html`, `id`, `admin_graphql_api_id`))
  const res = []
  res.push(FRONT_MATTER_START)
  res.push(frontMatter)
  res.push(FRONT_MATTER_END)
  res.push(product.body_html)
  return res.join(`\n`)
}

export const parseProduct = function (source) {
  let [frontMatter, body] = source.split(FRONT_MATTER_END)
  frontMatter = frontMatter.replace(FRONT_MATTER_START, ``)
  const data = JSON.parse(frontMatter)
  data.body_html = body.trim()
  return data
}
