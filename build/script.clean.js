const
  { print, separator, col } = require('./cli-utils'),
  shell = require('shelljs'),
  path = require('path')

shell.rm('-rf', path.resolve(__dirname, '../dist/*'))
shell.rm('-rf', path.resolve(__dirname, '../dist/.*'))
print([
  col('Cleaned build artifacts.', 'yellow'),
  col(separator(), 'yellow'), '\n'
])
