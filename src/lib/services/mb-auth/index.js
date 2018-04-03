import auth from '@feathersjs/authentication-client'
import BaseAuth from './base'

import Auth0 from './auth0'
import Local from './local'

const {
  EVENT_AUTH_CHANGE
} = BaseAuth

class MBAuth {
  static install (Vue, authConfig = {}) {
    if (!Vue || !Vue.mbConf) throw new Error('MBAuth: No MBConf')

    const
      // Basic conf
      mbc = Vue.mbConf,
      { auth0, feathers, local } = mbc.auth.client,
      //
      // Auth client config
      feathersConfig = Object.assign({}, authConfig, {
        storage: window.localStorage
      }, feathers),
      feathersClient = auth(feathersConfig, (...args) => {
        console.debug('Feathers client callback:', args)
      }),
      //
      // Provider config
      providerOpts = {
        client: feathersClient,
        config: feathersConfig
      }
    console.debug('Feathers client config:', feathers)

    let provider
    if (mbc.app.useAuth0) {
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
}

export {
  EVENT_AUTH_CHANGE
}

export default MBAuth
