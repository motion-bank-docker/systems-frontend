import auth0 from 'auth0-js'
import auth from '@feathersjs/authentication-client'
import { ObjectUtil } from 'mbjs-utils'

import router from '../../../router'
import BaseAuth from './base'

class Auth0 extends BaseAuth {
  constructor (opts = {}, env = {}) {
    super(ObjectUtil.merge({}, opts), env)

    const feathersConfig = ObjectUtil.merge({}, env.config)
    feathersConfig.storage = window.localStorage

    this._auth = env.client || auth(feathersConfig)
    this._webAuth = new auth0.WebAuth(this.options)
    this._feathersConfig = env.config || feathersConfig

    this._authDefaults = {
      audience: this.options.audience,
      scope: this.options.scope,
      responseType: this.options.responseType
      // redirectUri: this.options.redirectUri
    }

    this._defaultHeaders = {}
    const storageKey = this._feathersConfig.storageKey
    if (localStorage.getItem(storageKey)) {
      this._defaultHeaders = ObjectUtil.merge({}, this._defaultHeaders,
        this.getAuthHeader(localStorage.getItem(storageKey)))
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
    const
      _this = this,
      TAG = this.TAG
    return new Promise((resolve, reject) => {
      _this.webAuth.parseHash({ hash: window.location.hash }, (err, authResult) => {
        if (err) return reject(err)

        if (authResult && authResult.accessToken && authResult.idToken) {
          console.debug(TAG, 'Access Token:', authResult.accessToken)
          console.debug(TAG, 'ID Token:', authResult.idToken)

          _this.setSession(authResult)
          _this.webAuth.client.userInfo(authResult.accessToken, (err, user) => {
            if (err) return reject(err)

            localStorage.setItem('user', user)
            _this.emit(BaseAuth.EVENT_AUTH_CHANGE, { authenticated: true })

            resolve()
          })
        }
        else if (err) {
          console.error(TAG, err.error_description || err.code, err.error || err.message)
          reject(err)
        }
        else {
          reject(new Error(`${TAG} Handle auth result null or invalid`))
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
    const
      _this = this,
      TAG = this.TAG
    return new Promise((resolve, reject) => {
      _this.webAuth.checkSession(_this._authDefaults, (err, res) => {
        if (err) {
          if (err.error === 'login_required') return resolve()
          else {
            console.debug(TAG, 'checkSession:', err.error || err.message)
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
    return localStorage.getItem(this.feathersConfig.storageKey)
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
