import Vue from 'vue'
import Vuex from 'vuex'
import feathersVuex from 'feathers-vuex'

import mosysGridEditorStore from './modules/mosys-grid-editor-store'
import notifications from './modules/notifications'
import forms from './modules/forms'

import primus from '../clients/primus'
import rest from '../clients/rest'

Vue.use(Vuex)

const setupStore = function (Vue) {
  const
    mbConf = Vue.mbConf,
    apiHost = mbConf.app.hosts.api,
    authClient = Vue.mbAuth() ? Vue.mbAuth() : undefined
  /**
   * Set up VueX store with API service backends
   */
  let client

  if (mbConf.app.useWebSockets) {
    try {
      /**
       * WebSocket API connections
       */
      client = primus(apiHost, authClient)
    }
    catch (err) {
      console.debug(`Failed to instantiate WebSockets API client: ${err.message}`)
      console.warn('Falling back to REST API client...')
    }
  }

  if (!client) {
    /**
     * HTTP / REST API connections
     */
    client = rest(apiHost, authClient)
  }

  const
    opts = {idField: mbConf.app.idField},
    {service, auth} = feathersVuex(client, opts)

  return new Vuex.Store({
    plugins: [
      service('acls', opts),
      service('annotations', opts),
      service('maps', opts),
      service('users', opts),
      auth(authClient.feathersConfig)
    ],
    modules: {
      notifications,
      forms,
      mosysGridEditorStore
    }
  })
}

export {
  setupStore
}
