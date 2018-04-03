/**
 * MAIN APP
 */
const App = function () {
  /** Config getter */
  return {
    config: {
      //
      // Hosts definitions
      hosts: {
        api: process.env.HOSTS_API || 'https://motionbank-api.herokuapp.com',
        frontend: process.env.HOSTS_FRONTEND || 'http://localhost:8080',
        streamer: process.env.HOSTS_STREAMER || 'http://localhost:8888'
      },
      //
      // Params
      idField: process.env.PARAMS_ID_FIELD || 'uuid',
      //
      // Switches
      useAuth0: process.env.USE_AUTH0,
      useWebSockets: process.env.USE_WEB_SOCKETS
    }
  }
}

const { config } = App()
module.exports = { config }
