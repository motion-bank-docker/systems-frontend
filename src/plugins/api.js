import WebAuth from 'mbjs-api-client/src/web'

export default ({ Vue }) => {
  const apiClient = new WebAuth({
    auth: {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      redirectUri: process.env.AUTH0_REDIRECT_URL,
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile read write',
      responseType: 'token id_token',
      prompt: 'none'
    },
    host: process.env.API_HOST
  })
  Vue.prototype.$api = apiClient
}
