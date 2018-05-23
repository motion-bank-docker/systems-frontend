import feathers from '@feathersjs/feathers'

import primus from './primus'
import rest from './rest'

function createClient (transport, auth) {
  const client = feathers()
  client.configure(transport)
  if (auth) client.configure(auth)
  return client
}
export default createClient

export {
  primus,
  rest
}
