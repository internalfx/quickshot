
import _ from 'lodash'
import Promise from 'bluebird'
import inquirer from 'inquirer'

export default async function (config) {
  let choice = {}

  while (choice.action !== `< Go Back`) {
    const actionOpts = [`Logging`]

    actionOpts.push(`< Go Back`)

    choice = await inquirer.prompt([{
      type: `list`,
      name: `action`,
      message: `Configure Options`,
      choices: actionOpts
    }])

    if (choice.action === `Logging`) {
      const logSettings = await inquirer.prompt([
        {
          type: `confirm`,
          name: `enabled`,
          message: `Enable log file?`,
          default: config.enableLogfile
        }
      ])

      config.enableLogfile = logSettings.enabled
    }
  }

  return config
}
