import chalk from '@oclif/color'
import {test} from '@oclif/test'

chalk.enabled = false

describe('command_not_found', () => {
  test
    .stderr()
    .hook('command_not_found', {id: 'commans'})
    .catch('commans is not a @oclif/plugin-not-found command.\n' +
           'Run @oclif/plugin-not-found help for a list of available commands.\n\n' +
           'The most similar command is: commands')
    .end('runs hook with not found error')
})
