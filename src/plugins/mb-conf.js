import { ObjectUtil } from 'mbjs-utils'

export default ({ Vue }) => {
  const mbConf = ObjectUtil.merge({}, {
    app: require('../config/app').config,
    auth: require('../config/auth').config,
    scopes: require('../config/scopes').config,
    webpack: require('../config/webpack').config
  })
  Vue.mbConf = mbConf
  Vue.prototype.$mbConf = mbConf
}
