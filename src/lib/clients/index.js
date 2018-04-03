import feathers from '@feathersjs/feathers'

import primus from './primus'
import rest from './rest'

function createClient (transport, auth = undefined) {
  const client = feathers()
  client.configure(transport)
  if (auth) client.configure(auth)
  else console.warn('API Client: no authentication set!')
  return client
}
export default createClient

export {
  primus,
  rest
}
