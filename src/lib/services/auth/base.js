import TinyEmitter from 'tiny-emitter'

class BaseAuth extends TinyEmitter {
  constructor (opts = {}, env = {}) {
    super()

    this._config = opts
    this._client = env.client
    this._Vue = env.Vue

    this._auth = undefined
    this._user = undefined

    this.login = this.login.bind(this)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  login () {
    /* noop */
  }

  logout () {
    this._user = null
    this.emit(BaseAuth.EVENT_AUTH_CHANGE, { authenticated: false })
  }

  handleAuthentication () {
    /* noop */
  }

  setSession (authResult = undefined, silent = false) {
    if (!silent) this.emit(BaseAuth.EVENT_AUTH_CHANGE, { authenticated: true })
  }

  checkSession () {
    return Promise.resolve(false)
  }

  isAuthenticated () {
    return (this.user)
  }

  getAuthHeader (token = undefined) {
    return {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  }

  get authenticated () {
    return this.isAuthenticated()
  }

  get config () {
    return this._config
  }

  get auth () {
    return this._auth
  }

  get user () {
    return this._user
  }

  get client () {
    return this._client
  }

  static get EVENT_AUTH_CHANGE () {
    return 'authChange'
  }
}

export default BaseAuth
