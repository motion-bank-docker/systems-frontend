import GlobalConfig from '../../../global-config'
import auth from '@feathersjs/authentication-client'

import BaseAuth from './base'
import Auth0 from './auth0'
import Local from './local'

const {
  EVENT_AUTH_CHANGE
} = BaseAuth

class AuthService {
  static install (Vue, authConfig = GlobalConfig.auth) {
    let
      provider,
      client = auth(Object.assign({}, {
        storage: window.localStorage
      }, authConfig.client.feathers))

    if (GlobalConfig.app.useAuth0) {
      provider = new Auth0(authConfig.client.auth0, { client, Vue })
    }
    else {
      provider = new Local(authConfig.client.local, { client, Vue })
    }

    Vue.prototype.$authService = function () {
      return provider
    }
    Vue.authService = function () {
      return provider
    }
  }
}

export {
  EVENT_AUTH_CHANGE
}

export default AuthService
