/* global Primus */

import primus from '@feathersjs/primus-client'
import createClient from './index'

export default function (host, authService) {
  const defaultHeaders = authService.defaultHeaders()
  console.debug('WebSocket client headers:', defaultHeaders)
  return createClient(primus(new Primus(host)), authService.auth)
}
