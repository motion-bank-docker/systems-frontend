import auth0 from 'auth0-js'
import EventEmitter from 'EventEmitter'
import router from '../../router'
import * as auth0Conf from '../../../auth0.json'

const
  auth = new auth0.WebAuth(Object.assign({
    responseType: 'token id_token',
    scope: 'openid'
  }, auth0Conf)),
  authNotifier = new EventEmitter()

class Auth0 {
  constructor () {
    this.userProfile = null
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
    console.log(auth)
    auth.authorize()
  }

  logout () {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this.userProfile = null
    authNotifier.emit('authChange', false)
    // navigate to the home route
    router.replace('site.welcome')
  }

  handleAuthentication () {
    const _this = this
    auth.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        _this.setSession(authResult)
        console.log(authResult, _this)
        router.replace('edit')
      }
      else if (err) {
        router.replace('site.welcome')
        console.log(err)
      }
    })
  }

  setSession (authResult) {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    this.authNotifier.emit('authChange', { authenticated: true })
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}

export default Auth0
