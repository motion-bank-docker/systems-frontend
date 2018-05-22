const
  path = require('path'),
  basePath = path.join(__dirname, '..', '..')

const Webpack = function () {
  /** Config getter */
  return {
    config: {
      //
      // WEBPACK CONFIG
      //
      aliases: {
        quasar: path.join(basePath, 'node_modules', 'quasar-framework'),
        src: path.join(basePath, 'src'),
        assets: path.join(basePath, 'src', 'assets'),
        '@': path.join(basePath, 'src', 'components'),
        variables: path.join(basePath, 'src', 'themes', 'quasar.variables.styl')
      },
      //
      // Progress Bar Webpack plugin format
      // https://github.com/clessg/progress-bar-webpack-plugin#options
      progressFormat: ' [:bar] ' + ':percent'.bold + ' (:msg)',
      //
      // Default theme to build with ('ios' or 'mat')
      defaultTheme: process.env.QUASAR_THEME || 'mat',

      //
      // BUILD SETUPS
      //

      //
      // Production builds
      build: {
        env: {
          NODE_ENV: '"production"'
        },
        publicPath: process.env.PROD_PUBLIC_PATH || '',
        productionSourceMap: process.env.PROD_SOURCE_MAP,
        //
        // Remove unused CSS
        // Disable it if it has side-effects for your specific app
        purifyCSS: !process.env.PROD_CSS_NO_PURIFY
      },
      //
      // Development builds
      dev: {
        env: {
          NODE_ENV: '"development"'
        },
        cssSourceMap: !process.env.DEV_NO_CSS_MAP,
        openBrowser: !process.env.DEV_NO_OPEN,
        publicPath: process.env.DEV_PUBLIC_PATH || '/',
        port: parseInt(process.env.DEV_PORT || 8080),
        clearConsoleOnRebuild: process.env.DEV_CLEAR_CONSOLE,
        //
        // Proxy your API if using any.
        //
        // Also see /build/script.dev.js and search for "proxy api requests"
        // https://github.com/chimurai/http-proxy-middleware
        // TODO: proxy table should come in handy!
        proxyTable: {}
        /* {
          //
          // proxy all requests starting with /api
          '/api': {
            target: 'https://some.address.com/api',
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            }
          }
        } */
      }
    }
  }
}

const { config } = Webpack()
module.exports = { config }
