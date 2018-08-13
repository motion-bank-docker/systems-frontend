import mosysGridEditorStore from './modules/mosys-grid-editor-store'
import notifications from './modules/notifications'
import forms from './modules/forms'
import makeResourceModule from './modules/make-resource-module'
import auth from './modules/auth'
import acl from './modules/acl'

import WebAuth from 'mbjs-api-client/src/web'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const apiClient = new WebAuth({
  auth: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    redirectUri: process.env.AUTH0_REDIRECT_URL,
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile read write',
    responseType: 'token id_token'
  },
  host: process.env.API_HOST
})

/**
 * Set up VueX store with API service backends
 */
const store = new Vuex.Store({
  modules: {
    acl,
    notifications,
    forms,
    mosysGridEditorStore,
    annotations: makeResourceModule(apiClient, 'annotation'),
    maps: makeResourceModule(apiClient, 'map'),
    profiles: makeResourceModule(apiClient, 'profile'),
    sessions: makeResourceModule(apiClient, 'session'),
    metadata: makeResourceModule(apiClient, 'metadata', 'metadata', process.env.TRANSCODER_HOST),
    auth
  }
})

export default store
