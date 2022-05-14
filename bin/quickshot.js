#!/usr/bin/env node
import main from '../src/main.js'
import { log } from '../src/helpers.js'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

try {
  const result = await main(argv)
  await log(result, `green`)
} catch (err) {
  await log(err, `red`)
}
