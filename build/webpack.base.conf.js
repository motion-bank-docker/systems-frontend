const
  path = require('path'),
  webpack = require('webpack'),
  config = require('../config'),
  cssUtils = require('./css-utils'),
  env = require('./env-utils'),
  merge = require('webpack-merge'),
  projectRoot = path.resolve(__dirname, '../'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  appConfig = require('../package.json').appConfig,
  apiHost = process.env.API_HOST || appConfig.apiHost,
  frontendHost = process.env.FRONTEND_HOST || appConfig.frontendHost,
  streamerHost = process.env.STREAMER_HOST || appConfig.streamerHost,
  useAuth0 = (process.env.USE_AUTH0) || (appConfig.useAuth0),
  useWebSockets = (process.env.USE_WEBSOCKETS) || (appConfig.useWebSockets),
  useCssSourceMap =
    (env.dev && config.dev.cssSourceMap) ||
    (env.prod && config.build.productionSourceMap)

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

printBuildInfo()

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: config[env.prod ? 'build' : 'dev'].publicPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: config.aliases
  },
  module: {
    rules: [
      { // eslint
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        include: projectRoot,
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: cssUtils.postcss,
          loaders: merge({js: 'babel-loader'}, cssUtils.styleLoaders({
            sourceMap: useCssSourceMap,
            extract: env.prod
          }))
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config[env.prod ? 'build' : 'dev'].env,
      DEV: env.dev,
      PROD: env.prod,
      __THEME: '"' + env.platform.theme + '"',
      ROUTER_MODE: '"' + env.routerMode + '"'
    }),
    new webpack.DefinePlugin({
      API_HOST: JSON.stringify(apiHost),
      STREAMER_HOST: JSON.stringify(streamerHost),
      ID_FIELD: JSON.stringify(appConfig.idField),
      USE_AUTH0: JSON.stringify(useAuth0),
      USE_WEBSOCKETS: JSON.stringify(useWebSockets)
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: env.prod,
      options: {
        context: path.resolve(__dirname, '../src'),
        postcss: cssUtils.postcss
      }
    }),
    new ProgressBarPlugin({
      format: config.progressFormat
    })
  ],
  performance: {
    hints: false
  }
}

function printBuildInfo () {
  const
    // Some weird ass CLI stats
    CLI = require('./cli-utils'),
    // Get some tools
    { col, line, separator, print } = CLI,
    spacer = '\n\n',
    // Convert object to JSON
    text = CLI.toText(useAuth0 ? config.auth.auth0 : config.auth.local)

  // Assemble lines and print dat shit
  print([
    col(separator(), 'cyan'),
    col('WEBPACK Build settings', 'cyan', 'bold'),
    col(separator(), 'cyan'),
    line('API_HOST', apiHost),
    line('FRONTEND_HOST', frontendHost),
    line('STREAMER_HOST', streamerHost),
    col(separator(), 'cyan'),
    line('USE_AUTH0', useAuth0),
    line('USE_WEBSOCKETS', useWebSockets),
    col(separator(), 'cyan'),
    line('idField', appConfig.idField),
    line('Router mode', env.routerMode),
    spacer,
    col(`Auth config (${useAuth0 ? 'Auth0' : 'Local'}):`, 'cyan', 'bold'),
    col(separator(), 'cyan')
  ].concat(CLI.toLines(text).concat([spacer])))
}
