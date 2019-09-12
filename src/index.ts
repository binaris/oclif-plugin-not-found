import {color} from '@oclif/color'
import {Hook} from '@oclif/config'
import * as Levenshtein from 'fast-levenshtein'
import * as _ from 'lodash'

const hook: Hook.CommandNotFound = async function (opts) {
  const commandIDs = [
    ...opts.config.commands.filter(c => !c.hidden).map(c => c.id),
    ..._.flatten(opts.config.commands.filter(c => !c.hidden).map(c => c.aliases)),
    'version',
  ]
  if (!commandIDs.length) return
  function closest(cmd: string) {
    return _.minBy(commandIDs, c => Levenshtein.get(cmd, c))!
  }

  let binHelp = `${opts.config.bin} help`
  let idSplit = opts.id.split(':')
  if (await opts.config.findTopic(idSplit[0])) {
    // if valid topic, update binHelp with topic
    binHelp = `${binHelp} ${idSplit[0]}`
  }

  let suggestion: string = closest(opts.id)
  this.error(`${color.yellow(opts.id)} is not a ${opts.config.bin} command.\n` +
            `Run ${color.cmd(binHelp)} for a list of available commands.\n\n` +
            `The most similar command is: ${color.blueBright(suggestion)}`, {exit: 127})
}

export default hook
