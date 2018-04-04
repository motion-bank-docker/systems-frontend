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
        api: process.env.HOSTS_API || 'https://api.motionbank.org',
        frontend: process.env.HOSTS_FRONTEND || 'https://app.motionbank.org',
        streamer: process.env.HOSTS_STREAMER || 'https://streamer.motionbank.org'
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
