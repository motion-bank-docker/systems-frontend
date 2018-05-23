import auth0 from 'auth0-js'
import TinyEmitter from 'tiny-emitter'

class AuthService extends TinyEmitter {
  constructor (opts) {
    super()

    this._webAuth = new auth0.WebAuth(opts)
    this._user = undefined
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
    this.emit('auth-state', undefined)
  }

  checkSession () {
    const _this = this
    return new Promise((resolve, reject) => {
      this.webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          console.log('check session error', err)
          return reject(err)
        }
        console.log('check session authResult', authResult)
        _this.setSession(authResult.accessToken)
        resolve(authResult)
      })
    }).then(authResult => {
      return _this.getUserInfo(authResult.accessToken)
    })
  }

  handleAuthentication () {
    const _this = this
    return new Promise((resolve, reject) => {
      _this.webAuth.parseHash({ hash: window.location.hash }, function (err, authResult) {
        if (err) {
          console.error('auth error', err)
          return reject(err)
        }
        console.log('authResult', authResult)
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
      _this.webAuth.client.userInfo(token, function (err, user) {
        if (err) {
          console.error('user error', err)
          return reject(err)
        }
        _this._user = user
        _this.emit('auth-state', user)
        resolve(user)
      })
    })
  }

  setSession (authResult) {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
  }

  get user () {
    return this._user
  }

  get token () {
    return localStorage.getItem('access_token')
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
    responseType: 'token id_token'
  })
  Vue.prototype.$auth = authService
}
