import { AuthServiceAuth0, AuthServiceOauth2 } from 'mbjs-auth-service'
import AuthServiceElectron from 'mbjs-auth-service/src/auth-service-electron'

export default ({ Vue }) => {
  let authService
  if (process.env.IS_ELECTRON) {
    authService = new AuthServiceElectron()
  }
  else if (process.env.OAUTH_CLIENT_ID) {
    authService = new AuthServiceOauth2({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      redirectUri: process.env.OAUTH_REDIRECT_URL || `${document.location.origin}/users/callback`,
      redirectUriPassive: process.env.OAUTH_REDIRECT_URL_PASSIVE || `${document.location.origin}/users/callback_passive`,
      authorization: process.env.OAUTH_AUTH_URL,
      token: process.env.OAUTH_TOKEN_URL,
      profileEndpoint: `${process.env.API_HOST}user_profile/`,
      response_type: 'token'
    })
  }
  else if (process.env.AUTH0_CLIENT_ID) {
    authService = new AuthServiceAuth0({
      domain: process.env.AUTH0_DOMAIN || window.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID || window.AUTH0_CLIENT_ID,
      redirectUri: process.env.AUTH0_REDIRECT_URL || `${document.location.origin}/users/callback`,
      audience: process.env.AUTH0_AUDIENCE || window.AUTH0_AUDIENCE,
      scope: 'openid profile read write',
      responseType: 'token id_token',
      prompt: 'none'
    })
  }

  Vue.prototype.$auth = authService
}
