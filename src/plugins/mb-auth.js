import auth from '@feathersjs/authentication-client'
import { ObjectUtil } from 'mbjs-utils'
import BaseAuth from '../lib/services/mb-auth/base'

import Auth0 from '../lib/services/mb-auth/auth0'
import Local from '../lib/services/mb-auth/local'

const {
  EVENT_AUTH_CHANGE
} = BaseAuth

export {
  EVENT_AUTH_CHANGE
}

export default ({ Vue }) => {
  if (!Vue || !Vue.mbConf) throw new Error('MBAuth: No MBConf')
  //
  // Basic conf
  const { auth0, feathers, local } = Vue.mbConf.auth.client
  //
  // Auth client config
  const feathersConfig = ObjectUtil.merge({}, feathers)
  feathersConfig.storage = window.localStorage
  const feathersClient = auth(feathersConfig, (...args) => {
    console.debug('Feathers client callback:', args)
  })
  //
  // Provider config
  const providerOpts = {
    client: feathersClient,
    config: feathersConfig
  }
  console.debug('Feathers client config:', feathers)

  let provider
  if (Vue.mbConf.app.useAuth0) {
    provider = new Auth0(auth0, providerOpts)
  }
  else {
    provider = new Local(local, providerOpts)
  }

  Vue.prototype.$mbAuth = function () {
    return provider
  }
  Vue.mbAuth = function () {
    return provider
  }
}
