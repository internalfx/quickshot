
const _ = require(`lodash`)
const Promise = require(`bluebird`)
const path = require(`path`)
const fs = Promise.promisifyAll(require(`fs`))
const colors = require(`colors`)
const inquirer = Promise.promisifyAll(require(`inquirer`))
const moment = require(`moment`)
const context = require(`./context.js`)

const loadConfig = async function () {
  let config

  try {
    config = await fs.readFileAsync(path.join(process.cwd(), `quickshot.json`), `utf8`)
  } catch (err) {
    throw new Error(`Shop configuration is missing, have you run 'quickshot configure'?`)
  }

  try {
    config = JSON.parse(config)
  } catch (err) {
    throw new Error(`Shop configuration is corrupt, you may need to delete 'quickshot.json', and run 'quickshot config' again.`)
  }

  if (!config.configVersion || config.configVersion < context.configVersion) {
    throw new Error(`Shop configuration is from an older incompatible version of quickshot. You need to backup/remove your existing 'quickshot.json', and run 'quickshot config' again.`)
  }

  Object.assign(context.config, config)

  return config
}

const getTarget = async function (config, argv) {
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
            choices: targetChoices
          }
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

const ts = function () {
  return moment().format(`hh:mm:ss a`)
}

const log = function (content, color = `white`) {
  let data = null
  let message = null

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
  }

  if (data) {
    console.log(colors[color](`=== START OF OUTPUT ===`))
    console.dir(data, { depth: null })
    console.log(colors[color](`==== END OF OUTPUT ====`))
  }
}

const to = function (promise) {
  return promise.then(function (val) {
    return val
  }).catch(function (err) {
    err.isError = true
    return err
  })
}

const mkdir = async function (path) {
  try {
    await fs.mkdirAsync(path, { recursive: true })
  } catch (err) {
    if (err.code !== `EEXIST`) {
      throw err
    }
  }
}

const FRONT_MATTER_START = `<!--START-FRONT-MATTER`
const FRONT_MATTER_END = `END-FRONT-MATTER-->`

const stringifyPage = function (page) {
  const frontMatter = JSON.stringify(_.omit(page, `body_html`, `id`), null, 2)
  const res = []
  res.push(FRONT_MATTER_START)
  res.push(frontMatter)
  res.push(FRONT_MATTER_END)
  res.push(page.body_html)
  return res.join(`\n`)
}

const parsePage = function (source) {
  let [frontMatter, body] = source.split(FRONT_MATTER_END)
  frontMatter = frontMatter.replace(FRONT_MATTER_START, ``)
  const data = JSON.parse(frontMatter)
  data.body_html = body.trim()
  return data
}

module.exports = {
  loadConfig,
  getTarget,
  mkdir,
  log,
  to,
  stringifyPage,
  parsePage
}
