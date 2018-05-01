import auth from '@feathersjs/authentication-client'
import assert from 'assert'
import assignDeep from 'assign-deep'

import router from '../../../router'
import BaseAuth from './base'

class Local extends BaseAuth {
  constructor (opts = {}, env = {}) {
    super(opts, env)

    this._auth = auth(assignDeep({
      storage: window.localStorage
    }, opts))
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
    const _this = this
    assert.equal(typeof conf.store, 'object',
      `${this.TAG} You need to pass a store in conf obj`)

    /**
     * Strategy 'local' for retrieving the JWT via email/password
     */
    payload.strategy = 'local'
    return conf.store.dispatch('auth/authenticate', payload)
      .then(res => {
        if (res) {
          _this.setSession(res)
        }
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
    super.setSession(authResult)
  }

  checkSession (store) {
    const _this = this
    return store.dispatch('auth/authenticate')
      .then(res => {
        _this.setSession(res)
        return res
      })
      .catch(err => { if (err) throw err })
  }

  getAuthHeader (store) {
    return super.getAuthHeader(store && store.state ? store.state.auth.token : undefined)
  }
}

export default Local
