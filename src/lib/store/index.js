import buildVars from '../build-vars'

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
  /**
   * Set up VueX store with API service backends
   */
  let
    client,
    authClient = Vue.authService() ? Vue.authService().auth : undefined

  if (buildVars().useWebSockets) {
    try {
      /**
       * WebSocket API connections
       */
      client = primus(buildVars().apiHost, authClient)
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
    client = rest(buildVars().apiHost, authClient)
  }

  const
    idField = buildVars().idField,
    {service, auth} = feathersVuex(client, {idField})

  return new Vuex.Store({
    plugins: [
      service('annotations', {idField}),
      service('maps', {idField}),
      service('users', {idField}),
      auth({userService: 'users'})
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
