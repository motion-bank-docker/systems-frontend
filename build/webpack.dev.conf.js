const
  { col, separator, print } = require('./cli-utils'),
  config = require('../src/config'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  cssUtils = require('./css-utils'),
  baseWebpackConfig = require('./webpack.base.conf'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

print([
  col(separator('='), 'yellow'),
  col('DEV build', 'yellow', 'bold'), '\n'
])

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/hot-reload.js', baseWebpackConfig.entry[name]]
})

module.exports = merge(baseWebpackConfig, {
  // eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    noInfo: false
  },
  module: {
    rules: cssUtils.styleRules({
      sourceMap: (config.webpack.dev.cssSourceMap),
      postcss: true
    })
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin({
      clearConsole: (config.webpack.dev.clearConsoleOnRebuild)
    })
  ],
  performance: {
    hints: false
  }
})
