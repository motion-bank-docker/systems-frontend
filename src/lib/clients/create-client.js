import feathers from '@feathersjs/feathers'
import assignDeep from 'assign-deep'

function createClient (transport, auth = undefined) {
  const
    cg = require('../../config'),
    client = feathers()

  let feathersConfig
  try { feathersConfig = assignDeep({}, cg.auth.feathers.client) }
  catch (e) { /* ignored */ }

  client.configure(transport)
  if (auth) client.configure(auth, feathersConfig)
  else console.warn('API Client: no authentication set!')

  return client
}

export default createClient
