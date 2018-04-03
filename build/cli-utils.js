const chalk = require('chalk')

class CLI {
  static separator (len = 64, char = '-') {
    return new Array(len).fill(char).join('')
  }
  static writer (msg, out = process.stdout) {
    if (typeof out.write === 'function') out.write(' ' + msg + '\n')
  }
  static padLen (str, len = 23, char = ' ') {
    return str + new Array(len - str.length).fill(char).join('')
  }
  static label (str) {
    return CLI.padLen(str, 23, chalk.gray('.'))
  }
  static data (str) {
    return chalk.bold(str)
  }
  static line (label, datum, sep = ' ') {
    return `${CLI.label(label)}${sep}${CLI.data(datum)}`
  }
  static col (str, color = 'white', style = undefined) {
    str = chalk[color](str)
    return style ? chalk[style](str) : str
  }
  static toText (obj) {
    return JSON.stringify(obj, null, ' ')
  }
  static toLines (text) {
    return text.substr(1, text.length - 4)
      .replace(/[",]/g, '')
      .split('\n')
      .map(line => {
        const pair = line.split(':')
        if (pair.length > 1) return CLI.line(pair[0].substr(1), pair[1])
        return null
      })
      .filter(line => { return line !== null })
  }
  static print (lines) {
    lines.forEach(line => CLI.writer(line))
  }
}

module.exports = CLI
