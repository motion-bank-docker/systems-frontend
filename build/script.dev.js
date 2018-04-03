process.env.NODE_ENV = 'development'

const
  { col, separator, print } = require('./cli-utils'),
  path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  opn = require('opn'),
  proxyMiddleware = require('http-proxy-middleware'),

  // Configuration
  env = require('./env-utils'),
  config = require('../src/config'),
  webpackConfig = require('./webpack.dev.conf'),
  compiler = webpack(webpackConfig),

  // Define HTTP proxies to your custom API backend
  // https://github.com/chimurai/http-proxy-middleware
  proxyTable = config.webpack.dev.proxyTable,

  // Express
  app = express(),
  port = process.env.PORT || config.webpack.dev.port,
  uri = config.app.hosts.frontend

const theme = col(`"${config.webpack.defaultTheme}"`, 'yellow', 'bold')
let output = [
  col(separator(), 'cyan'),
  col('Starting dev server with ', 'cyan') + theme + col(' theme...', 'cyan'),
  col('Will listen at ') + col(uri, 'white', 'bold'),
  col(separator(), 'cyan')
]
if (config.webpack.dev.openBrowser) {
  output = output.concat(['\n', col('Browser will open when build is ready.', 'yellow', 'bold')])
}
print(output.concat(['\n\n']))

const
  devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
  }),
  hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: function () {}
  })

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy requests like API. See /config/index.js -> dev.proxyTable
// https://github.com/chimurai/http-proxy-middleware
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
const staticsPath = path.posix.join(webpackConfig.output.publicPath, 'statics/')
app.use(staticsPath, express.static('./src/statics'))

// try to serve Cordova statics for Play App
app.use(express.static(env.platform.cordovaAssets))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // open browser if set so in /config/index.js
  if (config.webpack.dev.openBrowser) {
    devMiddleware.waitUntilValid(function () {
      opn(uri)
    })
  }
})
