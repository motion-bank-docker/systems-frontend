import AuthServiceWeb from 'mbjs-quasar/src/lib/auth-service'
import AuthServiceElectron from 'mbjs-quasar/src/lib/auth-service-electron'

export default ({ Vue }) => {
  let authService
  if (process.env.IS_ELECTRON) {
    authService = new AuthServiceElectron()
  }
  else if (process.env.OAUTH_CLIENT_ID) {
    authService = new AuthServiceWeb({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      redirectUri: process.env.OAUTH_REDIRECT_URL || `${document.location.origin}/users/callback`,
      authorization: process.env.OAUTH_AUTH_URL,
      token: process.env.OAUTH_TOKEN_URL
    }, 'oauth2')
  }
  else if (process.env.AUTH0_CLIENT_ID) {
    authService = new AuthServiceWeb({
      domain: process.env.AUTH0_DOMAIN || window.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID || window.AUTH0_CLIENT_ID,
      redirectUri: process.env.AUTH0_REDIRECT_URL || `${document.location.origin}/users/callback`,
      audience: process.env.AUTH0_AUDIENCE || window.AUTH0_AUDIENCE,
      scope: 'openid profile read write',
      responseType: 'token id_token',
      prompt: 'none'
    }, 'auth0')
  }

  Vue.prototype.$auth = authService
}
