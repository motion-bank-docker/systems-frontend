var
  config = require('../config'),
  theme = process.argv[2] || config.defaultTheme

module.exports = {
  dev: process.env.NODE_ENV === 'development',
  prod: process.env.NODE_ENV === 'production',
  routerMode: process.env.ROUTER_MODE || 'history',

  platform: {
    theme: theme,
    cordovaAssets: './cordova/platforms/' + (theme === 'mat' ? 'android' : 'ios') + '/platform_www'
  }
}
