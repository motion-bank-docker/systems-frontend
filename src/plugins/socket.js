import VueSocketIO from 'vue-socket.io'
import { AuthServiceAuth0, AuthServiceOauth2 } from 'mbjs-auth-service'

export default ({ Vue }) => {
  if (!window.SOCKETS_HOST && !process.env.SOCKETS_HOST) return

  let token
  if (process.env.OAUTH_CLIENT_ID) {
    token = AuthServiceOauth2.getStorageKey('access_token')
  }
  else if (process.env.AUTH0_CLIENT_ID) {
    token = AuthServiceAuth0.getStorageKey('access_token')
  }
  Vue.use(new VueSocketIO({
    debug: true,
    connection: `${process.env.SOCKETS_HOST || window.SOCKETS_HOST}`,
    query: { token }
  }))
}
