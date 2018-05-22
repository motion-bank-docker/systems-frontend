import auth0 from 'auth0-js'
import TinyEmitter from 'tiny-emitter'

class AuthService extends TinyEmitter {
  constructor (opts) {
    super()

    this._webAuth = new auth0.WebAuth(opts)
    this._user = undefined
    this._token = undefined
  }

  authenticate () {
    this.webAuth.authorize()
  }

  login (payload) {
    this.webAuth.login(payload)
  }

  logout () {
    this.webAuth.logout()
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
        _this._token = authResult.accessToken
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
        _this._token = authResult.accessToken
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

  get user () {
    return this._user
  }

  get token () {
    return this._token
  }

  get isAuthenticated () {
    return this._user !== undefined
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
