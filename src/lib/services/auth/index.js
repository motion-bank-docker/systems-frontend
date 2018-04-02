import buildVars from '../../build-vars'
import auth from '@feathersjs/authentication-client'

import BaseAuth from './base'
import Auth0 from './auth0'
import Local from './local'

class AuthService {
  static install (Vue) {
    let
      provider,
      client = auth({
        storage: window.localStorage
      })

    if (buildVars().useAuth0) {
      const auth0Config = require('../../../../auth0.json')
      provider = new Auth0(auth0Config, { client, Vue })
    }
    else {
      provider = new Local({}, { client, Vue })
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
