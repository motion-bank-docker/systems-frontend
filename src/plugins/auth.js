import AuthService from 'mbjs-quasar/src/lib/auth-service'
import AuthServiceElectron from 'mbjs-quasar/src/lib/auth-service-electron'

export default ({ Vue }) => {
  let authService
  if (process.env.IS_ELECTRON) {
    authService = new AuthServiceElectron()
  }
  else {
    authService = new AuthService({
      domain: window.AUTH0_DOMAIN || process.env.AUTH0_DOMAIN,
      clientID: window.AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID,
      redirectUri: `${document.location.origin}/users/callback`,
      audience: window.AUTH0_AUDIENCE || process.env.AUTH0_AUDIENCE,
      scope: 'openid profile read write',
      responseType: 'token id_token'
    })
  }

  Vue.prototype.$auth = authService
}
