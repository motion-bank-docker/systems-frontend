const
  path = require('path'),
  pkg = require('../package.json')

module.exports = {
  // Webpack aliases
  aliases: {
    quasar: path.resolve(__dirname, '../node_modules/quasar-framework/'),
    src: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../src/assets'),
    '@': path.resolve(__dirname, '../src/components'),
    variables: path.resolve(__dirname, '../src/themes/quasar.variables.styl')
  },

  // Progress Bar Webpack plugin format
  // https://github.com/clessg/progress-bar-webpack-plugin#options
  progressFormat: ' [:bar] ' + ':percent'.bold + ' (:msg)',

  // Default theme to build with ('ios' or 'mat')
  defaultTheme: 'mat',

  appConfig: {
    apiHost: 'https://motionbank-api.herokuapp.com',
    streamerHost: 'http://localhost:8888',
    frontendHost: 'http://localhost:8080',
    idField: 'uuid',
    useAuth0: false,
    useWebSockets: false
  },

  auth: {
    feathers: {
      storageKey: process.env.FEATHERS_STORAGE_KEY || 'id_token',
      jwtStrategy: process.env.FEATHERS_JWT_STRATEGY || 'jwt'
    },
    common: {},
    auth0: {
      domain: process.env.AUTH0_DOMAIN || 'motionbank.eu.auth0.com',
      clientID: process.env.AUTH0_CLIENT_ID || 'lyVRrHYxUCOosFip40Ws5BRJyfHWSWTi',
      audience: process.env.AUTH0_AUDIENCE || 'https://motionbank.eu.auth0.com/userinfo',
      redirectUri: (process.env.FRONTEND_HOST || pkg.appConfig.frontendHost) + '/users/callback',
      scope: 'openid profile email',
      responseType: 'token id_token'
    },
    local: {}
  },

  build: {
    env: require('./prod.env'),
    publicPath: '',
    productionSourceMap: false,

    // Remove unused CSS
    // Disable it if it has side-effects for your specific app
    purifyCSS: true
  },
  dev: {
    env: require('./dev.env'),
    cssSourceMap: true,
    // auto open browser or not
    openBrowser: true,
    publicPath: '/',
    port: 8080,

    // If for example you are using Quasar Play
    // to generate a QR code then on each dev (re)compilation
    // you need to avoid clearing out the console, so set this
    // to "false", otherwise you can set it to "true" to always
    // have only the messages regarding your last (re)compilation.
    clearConsoleOnRebuild: false,

    // Proxy your API if using any.
    // Also see /build/script.dev.js and search for "proxy api requests"
    // https://github.com/chimurai/http-proxy-middleware
    proxyTable: {}
  }
}

/*
 * proxyTable example:
 *
   proxyTable: {
      // proxy all requests starting with /api
      '/api': {
        target: 'https://some.address.com/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
 */
