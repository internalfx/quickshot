
// let _ = require('lodash')
const Promise = require(`bluebird`)
const { loadConfig } = require(`../helpers`)
const path = require(`path`)
const fs = require(`fs`)
Promise.promisifyAll(fs)
const context = require(`../context.js`)

const inquirer = Promise.promisifyAll(require(`inquirer`))
const requireAll = require(`require-all`)

const quickshotignore = `
# This your '.quickshotignore' file. Anything you put in here will be ignored by quickshot.
# This file uses the same format as a '.gitignore' file.
`

module.exports = async function () {
  let config

  const actions = requireAll({
    dirname: path.join(__dirname, `config`)
  })

  try {
    config = await loadConfig()
  } catch (err) {}

  config = Object.assign({
    concurrency: 20,
    targets: []
  }, config)

  let choice = {}

  while (choice.action !== `Save configuration and exit`) {
    choice = await inquirer.prompt([{
      type: `list`,
      name: `action`,
      message: `Main Menu`,
      choices: [
        `targets`,
        `Save configuration and exit`
      ]
    }])

    if (actions[choice.action] != null) {
      await actions[choice.action](config)
    }
  }

  try {
    await fs.statAsync(path.join(process.cwd(), `.quickshot-ignore`))
  } catch (err) {
    await fs.writeFileAsync(path.join(process.cwd(), `.quickshot-ignore`), quickshotignore)
  }

  config.configVersion = context.configVersion
  await fs.writeFileAsync(path.join(process.cwd(), `quickshot.json`), JSON.stringify(config, null, 2))

  return `Configuration saved!\n`
}
