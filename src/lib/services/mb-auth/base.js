import TinyEmitter from 'tiny-emitter'

const { isUserAllowed } = require('../../../config/scopes')

class BaseAuth extends TinyEmitter {
  constructor (opts = {}, env = {}) {
    super()

    this._options = opts
    this._client = env.client
    this._config = env.config
    this._defaultHeaders = Object.assign({}, env.defaultHeaders || {})

    this._auth = undefined
    this._user = undefined

    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.logout = this.logout.bind(this)
    this.setSession = this.setSession.bind(this)
  }

  defaultHeaders () {
    return this._defaultHeaders
  }

  logout () {
    this._user = null
    this.emit(BaseAuth.EVENT_AUTH_CHANGE, { authenticated: false })
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

  isUserScopeAllowed (action, resource, fine) {
    return isUserAllowed(action, resource, fine)
  }

  getAuthHeader (token = undefined) {
    const authHeader = token ? `Bearer ${token}` : undefined
    if (this._defaultHeaders.Authorization) {
      this._defaultHeaders.Authorization = authHeader
    }
    return {
      Authorization: authHeader
    }
  }

  get authenticated () {
    return this.isAuthenticated()
  }

  get options () {
    return this._options
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

  get TAG () {
    return `${this.constructor.name}:`
  }
  static get TAG () {
    return `${this.name}:`
  }
}

export default BaseAuth
