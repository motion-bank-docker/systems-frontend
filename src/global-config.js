/* global CONFIG_APP, CONFIG_AUTH, CONFIG_SCOPES, CONFIG_WEBPACK */
import assignDeep from 'assign-deep'

class GlobalConfig {
  static get app () { return CONFIG_APP }
  static get auth () { return CONFIG_AUTH }
  static get scopes () { return CONFIG_SCOPES }
  static get webpack () { return CONFIG_WEBPACK }

  static install (Vue) {
    const globalConfig = {
      app: assignDeep({}, GlobalConfig.app),
      auth: assignDeep({}, GlobalConfig.auth),
      scopes: assignDeep({}, GlobalConfig.scopes),
      webpack: assignDeep({}, GlobalConfig.webpack)
    }
    console.log('GC', globalConfig)

    Vue.prototype.$globalConfig = globalConfig
    Vue.globalConfig = globalConfig
  }
}

export default GlobalConfig
