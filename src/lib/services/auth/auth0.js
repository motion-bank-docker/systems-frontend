import auth0 from 'auth0-js'
import router from '../../../router'
import assignDeep from 'assign-deep'

import BaseAuth from './base'

class Auth0 extends BaseAuth {
  constructor (opts = {}, env = {}) {
    super(assignDeep({
      responseType: 'token id_token',
      scope: 'openid profile email'
    }, opts), env)

    this._auth = new auth0.WebAuth(this.config)

    if (this._Vue && localStorage.getItem('access_token')) {
      const _this = this
      this._Vue.http = assignDeep(this._Vue.http || {}, {
        headers: {
          common: _this.getAuthHeader(localStorage.getItem('access_token'))
        }
      })
    }
  }

  login () {
    const config = this.config
    this.auth.authorize({
      audience: config.audience,
      scope: config.scope,
      responseType: config.responseType,
      redirectUri: config.redirectUri
    })
  }

  logout () {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    super.logout()
    router.replace('site.welcome')
  }

  handleAuthentication () {
    const _this = this
    return new Promise((resolve, reject) => {
      _this.auth.parseHash({ hash: window.location.hash }, (err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          _this.setSession(authResult)
          console.debug('Auth0 Access Token:', authResult.accessToken)
          console.debug('Auth0 ID Token:', authResult.idToken)
          _this.auth.client.userInfo(authResult.accessToken, (err, user) => {
            if (err) return reject(err)
            _this._user = user
            resolve({ authResult, user })
          })
        }
        else if (err) {
          console.error('Auth0:', err.error || err.message, err.error_description)
          reject(err)
        }
      })
    })
  }

  setSession (authResult) {
    let expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    super.setSession(authResult)
  }

  checkSession () {
    const
      _this = this,
      config = this.config
    return new Promise((resolve, reject) => {
      _this.auth.checkSession({
        audience: config.audience,
        scope: config.scope,
        responseType: config.responseType
      }, (err, res) => {
        if (err) return reject(err)
        _this.emit(BaseAuth.EVENT_AUTH_CHANGE, { authenticated: true })
        resolve(res)
      })
    })
  }

  isAuthenticated () {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt && (localStorage.getItem('id_token'))
  }
}

export default Auth0
