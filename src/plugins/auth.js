import AuthServiceWeb from 'mbjs-api-client/src/auth-service-web'

export default ({ Vue }) => {
  const authService = new AuthServiceWeb({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    redirectUri: process.env.AUTH0_REDIRECT_URL,
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile read write',
    responseType: 'token id_token',
    prompt: 'none'
  })
  Vue.prototype.$auth = authService
}
