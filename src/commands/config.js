
import path from 'path'
import context from '../context.js'
import fsp from 'fs/promises'
import inquirer from 'inquirer'

import actionOptions from './config/options.js'
import actionTargets from './config/targets.js'

const defaultQuickshotignore = `
# This your '.quickshotignore' file. Anything you put in here will be ignored by quickshot.
# This file uses the same format as a '.gitignore' file.
`

export default async function () {
  let config = context.config

  const actions = {
    options: actionOptions,
    targets: actionTargets,
  }

  config = {
    concurrency: 20,
    targets: [],
    ...config,
  }

  let choice = {}

  while (choice.action !== `Save configuration and exit`) {
    choice = await inquirer.prompt([{
      type: `list`,
      name: `action`,
      message: `Main Menu`,
      choices: [
        ...Object.keys(actions),
        `Save configuration and exit`,
      ],
    }])

    if (actions[choice.action] != null) {
      await actions[choice.action](config)
    }
  }

  try {
    await fsp.stat(path.join(process.cwd(), `.quickshot-ignore`))
  } catch (err) {
    await fsp.writeFile(path.join(process.cwd(), `.quickshot-ignore`), defaultQuickshotignore)
  }

  config.configVersion = context.configVersion
  await fsp.writeFile(path.join(process.cwd(), `quickshot.json`), JSON.stringify(config, null, 2))

  return `Configuration saved!\n`
}
