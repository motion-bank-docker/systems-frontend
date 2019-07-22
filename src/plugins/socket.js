import VueSocketIO from 'vue-socket.io'

export default ({ Vue }) => {
  if (!process.env.SOCKETS_HOST) return

  Vue.use(new VueSocketIO({
    debug: true,
    connection: `${process.env.SOCKETS_HOST}`,
    query: {
      token: localStorage.getItem('access_token')
    }
  }))
}
