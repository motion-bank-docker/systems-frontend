import buildVars from '../../build-vars'
import auth from '@feathersjs/authentication-client'

import BaseAuth from './base'
import Auth0 from './auth0'
import Local from './local'

const authConfig = require('../../../../config').auth

class AuthService {
  static install (Vue) {
    let
      provider,
      client = auth(Object.assign({}, authConfig.feathers, {
        storage: window.localStorage
      }))

    if (buildVars().useAuth0) {
      provider = new Auth0(authConfig.auth0, { client, Vue })
    }
    else {
      provider = new Local(authConfig.local, { client, Vue })
    }

    Vue.prototype.$authService = function () {
      return provider
    }
    Vue.authService = function () {
      return provider
    }
  }
}

const { EVENT_AUTH_CHANGE } = BaseAuth
export {
  EVENT_AUTH_CHANGE
}

export default AuthService
