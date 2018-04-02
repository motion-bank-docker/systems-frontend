import router from '../../../router'
import auth from '@feathersjs/authentication-client'
import assert from 'assert'

import BaseAuth from './base'

class Local extends BaseAuth {
  constructor (opts = {}, env = {}) {
    super(opts, env)

    this._auth = auth({
      storage: window.localStorage
    })
  }

  login () {
    router.push({ name: 'users.login' })
  }

  logout (store) {
    return store.dispatch('auth/logout')
      .then(() => {
        super.logout()
        router.replace({ name: 'site.welcome' })
      })
  }

  handleAuthentication (payload, conf = {}) {
    assert.equal(typeof conf.store, 'object', 'You need to pass a store in conf obj')
    /**
     * Strategy 'local' for retrieving the JWT via email/password
     */
    payload.strategy = 'local'
    return conf.store.dispatch('auth/authenticate', payload)
      .then(() => {
        /**
         * If there is a saved original destination, redirect there
         */
        if (conf.redirect) {
          return router.replace(conf.redirect)
        }
        /**
         * Otherwise redirect to users edit page
         */
        router.replace({ name: 'users.edit', params: { id: 'me' } })
      })
      .catch(err => {
        const message = `${err.message}${err.code ? ' (Code: ' + err.code + ')' : ''}`
        if (err.code !== 401) {
          conf.store.commit('notifications/addMessage', {
            body: message,
            type: 'error'
          })
        }
      })
  }

  setSession (authResult) {
    let expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    super.setSession(authResult)
  }

  checkSession (store) {
    const _this = this
    return store.dispatch('auth/authenticate')
      .then(res => {
        _this.emit(BaseAuth.EVENT_AUTH_CHANGE, { authenticated: true })
        return res
      })
      .catch(err => { if (err) throw err })
  }

  getAuthHeader (store) {
    return super.getAuthHeader(store && store.state ? store.state.auth.token : undefined)
  }
}

export default Local
