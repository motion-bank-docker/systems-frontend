import auth0 from 'auth0-js'
import EventEmitter from 'EventEmitter'
import router from '../../router'
import * as auth0Conf from '../../../auth0.json'

const
  auth = new auth0.WebAuth(Object.assign({
    responseType: 'token id_token',
    scope: 'openid profile email'
  }, auth0Conf)),
  authNotifier = new EventEmitter()

class Auth0 {
  constructor () {
    this._user = null
    this.login = this.login.bind(this)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  get authNotifier () {
    return authNotifier
  }

  get authenticated () {
    this.isAuthenticated()
  }

  login () {
    auth.authorize({
      access_type: 'offline'
    })
  }

  logout () {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this._user = null
    authNotifier.emit('authChange', false)
    // navigate to the home route
    router.replace('site.welcome')
  }

  handleAuthentication () {
    const _this = this
    return new Promise((resolve, reject) => {
      auth.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          _this.setSession(authResult)
          console.log('Auth0 Access Token:', authResult.accessToken)
          console.log('Auth0 ID Token:', authResult.idToken)
          auth.client.userInfo(authResult.accessToken, (err, user) => {
            if (err) return reject(err)
            _this._user = user
            resolve({ authResult, user })
          })
        }
        else if (err) {
          console.log('Auth0:', err.error || err.message, err.error_description)
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
    this.authNotifier.emit('authChange', { authenticated: true })
  }

  checkSession () {
    return new Promise((resolve, reject) => {
      auth.checkSession({
        scope: 'openid profile email'
      }, (err, res) => {
        if (err) return reject(err)
        return res
      })
    })
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }

  get user () {
    return this._user
  }
}

export default Auth0
