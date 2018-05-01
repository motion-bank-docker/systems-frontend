process.env.NODE_ENV = 'production'

const
  { col, separator, print } = require('./cli-utils'),
  shell = require('shelljs'),
  path = require('path'),
  css = require('./css-utils'),
  config = require('../src/config'),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.prod.conf'),
  targetPath = path.join(__dirname, '../dist')

require('./script.clean.js')

printBuildInfo()

shell.mkdir('-p', targetPath)
shell.cp('-R', 'src/statics', targetPath)

webpack(webpackConfig, function (err, stats) {
  if (err) throw err

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')

  if (stats.hasErrors()) {
    process.exit(1)
  }

  if (config.webpack.build.purifyCSS) {
    css.purify(finalize)
  }
  else {
    finalize()
  }
})

function printBuildInfo () {
  const theme = col(`"${config.webpack.defaultTheme}"`, 'yellow', 'bold')
  print([
    col(separator(), 'red'),
    col('WARNING!', 'red', 'bold'),
    col(separator(), 'red'),
    col('Do NOT use VueRouter\'s ' + col('"history"', 'white', 'bold') + ' mode'),
    col('if building for Cordova or Electron.'), '\n\n',
    col(separator(), 'cyan'),
    col('Building Quasar App with ', 'cyan') + theme + col(' theme...', 'cyan'), '\n'
  ])
}
function finalize () {
  const theme = col(`"${config.webpack.defaultTheme}"`, 'yellow', 'bold')
  print([
    '\n', col(separator('='), 'cyan'),
    col('Build complete with ' + theme + ' theme in ' +
      col('"/dist"', 'yellow', 'bold') + ' folder.'),
    col(separator(), 'cyan'),
    col('Built files are meant to be served over an HTTP server.'),
    col('Opening index.html over file:// won\'t work.'), '\n\n'
  ])
}
