import auth0 from 'auth0-js'
import auth from '@feathersjs/authentication-client'
import router from '../../../router'
import assignDeep from 'assign-deep'

import BaseAuth from './base'

class Auth0 extends BaseAuth {
  constructor (opts = {}, env = {}) {
    super(assignDeep({
      responseType: 'token id_token',
      scope: 'openid profile email'
    }, opts), env)

    const
      config = require('../../../../config'),
      feathersConfig = Object.assign({}, config.auth.feathers, {
        storage: window.localStorage
      })

    this._auth = auth(feathersConfig)
    this._webAuth = new auth0.WebAuth(this.config)
    this._feathersConfig = feathersConfig
    this._authDefaults = {
      audience: this.config.audience,
      scope: this.config.scope,
      responseType: this.config.responseType
      // redirectUri: this.config.redirectUri
    }

    this._defaultHeaders = {}
    if (localStorage.getItem('id_token')) {
      this._defaultHeaders = Object.assign({}, this._defaultHeaders,
        this.getAuthHeader(localStorage.getItem('id_token')))
    }
  }

  login () {
    this.webAuth.authorize(this._authDefaults)
  }

  logout () {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('user')
    super.logout()
    router.replace({ name: 'site.welcome' })
  }

  handleAuthentication () {
    const _this = this
    return new Promise((resolve, reject) => {
      _this.webAuth.parseHash({ hash: window.location.hash }, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.debug('Auth0 Access Token:', authResult.accessToken)
          console.debug('Auth0 ID Token:', authResult.idToken)
          _this.setSession(authResult)
          _this.webAuth.client.userInfo(authResult.accessToken, (err, user) => {
            if (err) return reject(err)
            localStorage.setItem('user', user)
            _this.emit(BaseAuth.EVENT_AUTH_CHANGE, { authenticated: true })
            resolve()
          })
        }
        else if (err) {
          console.error('Auth0:', err.error || err.message, err.error_description)
          reject(err)
        }
        else {
          reject(new Error('Auth0: Handle auth result null or invalid'))
        }
      })
    })
  }

  setSession (authResult, silent = false) {
    let expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    super.setSession(authResult, silent)
  }

  checkSession () {
    const _this = this
    return new Promise((resolve, reject) => {
      _this.webAuth.checkSession(_this._authDefaults, (err, res) => {
        if (err) {
          if (err.error === 'login_required') return resolve()
          else {
            console.debug('Auth0 check session:', err.error, err)
            return reject(err)
          }
        }
        _this.emit(BaseAuth.EVENT_AUTH_CHANGE, { authenticated: true })
        resolve(res)
      })
    })
  }

  isAuthenticated () {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt && (this.token)
  }

  getAuthHeader () {
    return super.getAuthHeader(this.token)
  }

  get token () {
    return localStorage.getItem('id_token')
  }

  get webAuth () {
    return this._webAuth
  }

  get feathersConfig () {
    return this._feathersConfig
  }

  get user () {
    return localStorage.getItem('user')
  }
}

export default Auth0
