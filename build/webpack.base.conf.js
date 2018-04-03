const
  path = require('path'),
  webpack = require('webpack'),
  config = require('../src/config'),
  cssUtils = require('./css-utils'),
  env = require('./env-utils'),
  merge = require('webpack-merge'),
  projectRoot = path.resolve(__dirname, '../'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin'),
  useCssSourceMap =
    (env.dev && config.webpack.dev.cssSourceMap) ||
    (env.prod && config.webpack.build.productionSourceMap)

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
    publicPath: config.webpack[env.prod ? 'build' : 'dev'].publicPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: config.webpack.aliases
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
      'process.env': config.webpack[env.prod ? 'build' : 'dev'].env,
      DEV: env.dev,
      PROD: env.prod,
      __THEME: '"' + config.webpack.defaultTheme + '"',
      ROUTER_MODE: '"' + env.routerMode + '"'
    }),
    new webpack.DefinePlugin({
      CONFIG_APP: JSON.stringify(config.app),
      CONFIG_AUTH: JSON.stringify(config.auth),
      CONFIG_SCOPES: JSON.stringify(config.scopes),
      CONFIG_WEBPACK: JSON.stringify(config.webpack)
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: (env.prod),
      options: {
        context: path.resolve(__dirname, '../src'),
        postcss: cssUtils.postcss
      }
    }),
    new ProgressBarPlugin({
      format: config.webpack.progressFormat
    })
  ],
  performance: {
    hints: false
  }
}

function printBuildInfo () {
  const
    { app, auth } = config,
    //
    // Some weird ass CLI stats
    CLI = require('./cli-utils'),
    //
    // Get some tools
    { col, line, separator, print } = CLI,
    //
    // Convert object to JSON
    text = CLI.toText(app.useAuth0 ? auth.client.auth0 : auth.client.local)
  //
  // Assemble lines and print dat shit
  print([
    col(separator('='), 'cyan'),
    col('WEBPACK', 'cyan', 'bold'),
    col('Environment variables', 'cyan'),
    col(separator(), 'cyan'),
    line('HOSTS_API', app.hosts.api),
    line('HOSTS_FRONTEND', app.hosts.frontend),
    line('HOSTS_STREAMER', app.hosts.streamer),
    col(separator(), 'cyan'),
    line('USE_AUTH0', app.useAuth0),
    line('USE_WEBSOCKETS', app.useWebSockets),
    col(separator(), 'cyan'),
    line('idField', app.idField),
    line('Router mode', env.routerMode), '\n',
    col(separator('='), 'cyan'),
    col(`AUTH`, 'cyan', 'bold'),
    col(`Active configuration: ${app.useAuth0 ? 'Auth0' : 'Local'}`, 'cyan'),
    col(separator(), 'cyan')
  ].concat(CLI.toLines(text).concat(['\n\n'])))
}
