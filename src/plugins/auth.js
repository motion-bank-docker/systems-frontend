import AuthService from 'mbjs-quasar/src/lib/auth-service'
import AuthServiceElectron from 'mbjs-quasar/src/lib/auth-service-electron'

export default ({ Vue }) => {
  let authService
  if (process.env.IS_ELECTRON) {
    authService = new AuthServiceElectron()
  }
  else {
    authService = new AuthService({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      redirectUri: process.env.AUTH0_REDIRECT_URL,
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile read write',
      responseType: 'token id_token'
    })
  }

  Vue.prototype.$auth = authService
}
