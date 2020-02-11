import Vue from 'vue'
import Vuex from 'vuex'
import { Platform } from 'quasar'

Vue.use(Vuex)

import WebAuth from 'mbjs-api-client/src/web'
import AuthServiceOauth2 from 'mbjs-auth-service/src/auth-service-oauth2'
import { makeResourceModule } from 'mbjs-quasar/src/lib'

/** Import resource Data Models */
import {
  Annotation,
  Map,
  Document,
  Cell
} from 'mbjs-data-models/src/models'

/** Import custom modules */
import {
  auth,
  acl,
  files,
  tags,
  metadata,
  mosys,
  notifications,
  swimLane,
  vocabularies
} from './modules'

import mediaFactory from './modules/media'
import annotationsFactory from './modules/annotations'
import autosuggestFactory from './modules/autosuggest'

/** Instantiate Motion Bank API Client */
let apiClient

if (process.env.USE_NEDB) {
  /** Instantiate NeDB Client */
  let filename
  filename = process.env.NEDB_FILENAME || undefined
  if (Platform.is.electron) {
    const
      path = require('path'),
      { app } = require('electron').remote
    filename = path.join(app.getPath('userData'), 'resources')
  }
  const NedbClient = require('../lib/nedb-client').default
  apiClient = new NedbClient({ filename })
}
else {
  /** Instantiate Motion Bank API Client */
  if (!process.env.OAUTH_CLIENT_ID) {
    apiClient = new WebAuth({
      auth: {
        domain: process.env.AUTH0_DOMAIN || window.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID || window.AUTH0_CLIENT_ID,
        redirectUri: process.env.AUTH0_REDIRECT_URL || `${document.location.origin}/users/callback`,
        audience: process.env.AUTH0_AUDIENCE || window.AUTH0_AUDIENCE,
        scope: 'openid profile read write',
        responseType: 'token id_token',
        prompt: 'none'
      },
      host: process.env.API_HOST || window.API_HOST
    })
  }
  else if (process.env.OAUTH_CLIENT_ID) {
    apiClient = new AuthServiceOauth2({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      redirectUri: process.env.OAUTH_REDIRECT_URL || `${document.location.origin}/users/callback`,
      redirectUriPassive: process.env.OAUTH_REDIRECT_URL_PASSIVE || `${document.location.origin}/users/callback_passive`,
      authorization: process.env.OAUTH_AUTH_URL,
      token: process.env.OAUTH_TOKEN_URL,
      profileEndpoint: `${process.env.API_HOST}user_profile/`,
      response_type: 'token'
    })
  }
}

/**
 * Set up VueX store
 */
const mobaApiModules = {
  /** Basic resources using API Client */
  annotations: makeResourceModule(apiClient, Annotation, 'annotation'),
  maps: makeResourceModule(apiClient, Map, 'map'),
  cells: makeResourceModule(apiClient, Cell, 'cell'),
  documents: makeResourceModule(apiClient, Document, 'document'),
  profiles: makeResourceModule(apiClient, undefined, 'profile'),
  sessions: makeResourceModule(apiClient, undefined, 'session')
}
const getRequestConfig = () => {
  return {
    headers: {
      Authorization: `${apiClient.tokenType} ${apiClient.token}`
    }
  }
}
const pbaModules = {
  annotations: annotationsFactory({ getRequestConfig, auth: apiClient }),
  media: mediaFactory({ getRequestConfig, auth: apiClient }),
  autosuggest: autosuggestFactory({ getRequestConfig, auth: apiClient })
}
const modules = {
  /** Custom stores */
  auth,
  mosys,
  notifications,
  swimLane,
  vocabularies
}
for (let key in mobaApiModules) {
  if (mobaApiModules[key]) modules[key] = mobaApiModules[key]
}
for (let key in pbaModules) {
  if (pbaModules[key]) modules[key] = pbaModules[key]
}
if (process.env.USE_ACL) {
  modules.acl = acl
}
if (process.env.USE_FILES) {
  modules.files = files
}
if (process.env.USE_TAGS) {
  modules.tags = tags
}
if (process.env.USE_METADATA) {
  modules.metadata = Platform.is.electron ? require('./modules/metadata-ffprobe').default : metadata
}
const store = new Vuex.Store({
  modules
})

export default store
