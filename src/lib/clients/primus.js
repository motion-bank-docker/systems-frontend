/* global Primus */

import primus from '@feathersjs/primus-client'
import createClient from './index'

export default function (host, authService = undefined) {
  const
    defaultHeaders = authService.defaultHeaders(),
    { auth } = authService
  console.log('WebSocket client:', defaultHeaders)
  return createClient(primus(new Primus(host)), auth)
}
