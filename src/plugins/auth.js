import auth0 from 'auth0-js'
import TinyEmitter from 'tiny-emitter'

class AuthService extends TinyEmitter {
  constructor (opts) {
    super()

    this._webAuth = new auth0.WebAuth(opts)
    this._user = undefined
    this._scope = []
  }

  authenticate () {
    this.webAuth.authorize()
  }

  login (payload) {
    this.webAuth.login(payload)
  }

  logout () {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('user')
    this.emit('auth-state', undefined)
    this.webAuth.logout({ returnTo: process.env.UI_HOST })
  }

  checkSession () {
    const _this = this
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem('access_token')) return resolve()
      const expires = JSON.parse(localStorage.getItem('expires_at'))
      if (expires > new Date().getTime()) resolve({ accessToken: localStorage.getItem('access_token') })
      else {
        this.webAuth.checkSession({}, (err, authResult) => {
          if (err) {
            console.log('check session error', err)
            return reject(err)
          }
          _this.setSession(authResult)
          resolve(authResult)
        })
      }
    }).then(authResult => {
      if (authResult) return _this.getUserInfo(authResult.accessToken)
    })
  }

  handleAuthentication () {
    const _this = this
    return new Promise((resolve, reject) => {
      _this.webAuth.parseHash({ hash: window.location.hash }, function (err, authResult) {
        if (err) {
          console.error('Auth0 Error', err)
          return reject(err)
        }
        _this.setSession(authResult)
        resolve(authResult)
      })
    }).then(authResult => {
      return _this.getUserInfo(authResult.accessToken)
    })
  }

  getUserInfo (token) {
    const _this = this
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'))
        _this.emit('auth-state', user)
        resolve(user)
      }
      _this.webAuth.client.userInfo(token, function (err, user) {
        if (err) {
          console.error('Auth0 User Info Error', err)
          return reject(err)
        }
        localStorage.setItem('user', JSON.stringify(user))
        _this._user = user
        _this.emit('auth-state', user)
        resolve(user)
      })
    })
  }

  setSession (authResult) {
    console.debug('Auth0 Result', authResult)
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
    if (typeof authResult.scope === 'string') this._scope = authResult.scope.split(' ')
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
  }

  hasScope (scope) {
    return this.scope.indexOf(scope) > -1
  }

  get user () {
    return this._user
  }

  get token () {
    return localStorage.getItem('access_token')
  }

  get scope () {
    return this._scope
  }

  get isAuthenticated () {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    const isValidToken = new Date().getTime() < expiresAt
    return isValidToken && this._user !== undefined
  }

  get webAuth () {
    return this._webAuth
  }
}

export default ({ Vue }) => {
  const authService = new AuthService({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    redirectUri: process.env.AUTH0_REDIRECT_URL,
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile read write',
    responseType: 'token id_token'
  })
  Vue.prototype.$auth = authService
}
