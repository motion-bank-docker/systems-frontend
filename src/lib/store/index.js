import buildVars from '../build-vars'

import mosysGridEditorStore from './modules/mosys-grid-editor-store'
import notifications from './modules/notifications'
import forms from './modules/forms'

// import primus from '../clients/primus'
import rest from '../clients/rest'

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
  client = rest(buildVars().apiHost)
}

/**
 * Set up VueX store with API service backends
 */
const { service, auth } = feathersVuex(client, { idField: buildVars().idField })
const store = new Vuex.Store({
  plugins: [
    service('annotations', { idField: buildVars().idField }),
    service('maps', { idField: buildVars().idField }),
    service('users', { idField: buildVars().idField }),
    auth({ userService: 'users' })
  ],
  modules: {
    notifications,
    forms,
    mosysGridEditorStore
  }
})

export default store
