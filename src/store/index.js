import Vue from 'vue'
import Vuex from 'vuex'
import { Platform } from 'quasar'

Vue.use(Vuex)

import WebAuth from 'mbjs-api-client/src/web'
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

/**
 * Set up VueX store
 */
const store = new Vuex.Store({
  modules: {
    /** Basic resources using API Client */
    annotations: makeResourceModule(apiClient, Annotation, 'annotation'),
    maps: makeResourceModule(apiClient, Map, 'map'),
    cells: makeResourceModule(apiClient, Cell, 'cell'),
    documents: makeResourceModule(apiClient, Document, 'document'),
    profiles: makeResourceModule(apiClient, undefined, 'profile'),
    sessions: makeResourceModule(apiClient, undefined, 'session'),

    /** Custom stores */
    acl,
    auth,
    files,
    tags,
    metadata: Platform.is.electron ? require('./modules/metadata-ffprobe').default : metadata,
    mosys,
    notifications,
    swimLane,
    vocabularies
  }
})

export default store
