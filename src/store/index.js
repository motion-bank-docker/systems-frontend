import mosysGridEditorStore from './modules/mosys-grid-editor-store'
import notifications from './modules/notifications'
import forms from './modules/forms'

// import primus from '../lib/clients/primus'
import rest from '../lib/clients/rest'

import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'

Vue.use(Vuex)

let client

try {
  /**
   * WebSocket API connections
   */
  // client = primus(buildVars().apiHost)
}
catch (err) {
  console.warn(`Failed to instantiate WebSockets API client: ${err.message}`)
  console.log('Falling back to REST API client...')
}

if (!client) {
  /**
   * HTTP / REST API connections
   */
  client = rest(process.env.API_HOST)
}

/**
 * Set up VueX store with API service backends
 */
const { service } = feathersVuex(client, { idField: process.env.ID_FIELD })
const store = new Vuex.Store({
  plugins: [
    service('annotations', { idField: process.env.ID_FIELD }),
    service('maps', { idField: process.env.ID_FIELD }),
    service('users', { idField: process.env.ID_FIELD })
    /*
    auth({
      userService: 'users',
      storage: window.localStorage,
      storageKey: 'access_token',
      jwt: {
        algorithms: ['RS256']
      }
    })
    */
  ],
  modules: {
    notifications,
    forms,
    mosysGridEditorStore
  }
})

export default store
