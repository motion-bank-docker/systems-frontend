/* global Primus */

import primus from '@feathersjs/primus-client'
import createClient from './index'

export default function (host, mBAuth) {
  const defaultHeaders = mBAuth.defaultHeaders()
  console.debug('WebSocket client headers:', defaultHeaders)
  return createClient(primus(new Primus(host)), mBAuth.auth)
}
