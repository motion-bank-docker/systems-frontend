import mosysGridEditorStore from './modules/mosys-grid-editor-store'
import notifications from './modules/notifications'
import forms from './modules/forms'
import makeResourceModule from './modules/make-resource-module'
import auth from './modules/auth'
import acl from './modules/acl'
import timecodes from './modules/timecodes'
import conversions from './modules/conversions'
import metadata from './modules/metadata'
import tags from './modules/tags'
import assets from './modules/assets'

import WebAuth from 'mbjs-api-client/src/web'
import Vue from 'vue'
import Vuex from 'vuex'

import {
  Annotation,
  Map,
  Document
} from 'mbjs-data-models/src/models'

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
    conversions,
    notifications,
    forms,
    timecodes,
    mosysGridEditorStore,
    annotations: makeResourceModule(apiClient, Annotation, 'annotation'),
    maps: makeResourceModule(apiClient, Map, 'map'),
    documents: makeResourceModule(apiClient, Document, 'document'),
    profiles: makeResourceModule(apiClient, undefined, 'profile'),
    sessions: makeResourceModule(apiClient, undefined, 'session'),
    // metadata: makeResourceModule(apiClient, undefined, 'metadata', 'metadata', process.env.TRANSCODER_HOST),
    metadata,
    tags,
    assets,
    auth
  }
})

export default store
