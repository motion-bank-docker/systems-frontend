/* global CONFIG_APP, CONFIG_AUTH, CONFIG_SCOPES, CONFIG_WEBPACK */
import assignDeep from 'assign-deep'

class MBConf {
  static get app () { return CONFIG_APP }
  static get auth () { return CONFIG_AUTH }
  static get scopes () { return CONFIG_SCOPES }
  static get webpack () { return CONFIG_WEBPACK }

  static install (Vue) {
    const mbConf = assignDeep({}, {
      app: MBConf.app,
      auth: MBConf.auth,
      scopes: MBConf.scopes,
      webpack: MBConf.webpack
    })
    Vue.mbConf = mbConf
    Vue.prototype.$mbConf = mbConf
    console.debug(`Configurations registered: ${Object.keys(Vue.mbConf).join(', ')}`)
  }
}

export default MBConf
