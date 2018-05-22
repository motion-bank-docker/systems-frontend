import { ObjectUtil } from 'mbjs-utils'

export default ({ Vue }) => {
  const mbConf = ObjectUtil.merge({}, {
    app: require('../lib/config/app').config,
    auth: require('../lib/config/auth').config,
    scopes: require('../lib/config/scopes').config,
    webpack: require('../lib/config/webpack').config
  })
  Vue.mbConf = mbConf
  Vue.prototype.$mbConf = mbConf
}
