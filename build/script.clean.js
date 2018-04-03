const
  { print } = require('./cli-utils'),
  shell = require('shelljs'),
  path = require('path')

shell.rm('-rf', path.resolve(__dirname, '../dist/*'))
shell.rm('-rf', path.resolve(__dirname, '../dist/.*'))
print(['Cleaned build artifacts.', '\n'])
