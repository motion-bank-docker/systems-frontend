import rest from '@feathersjs/rest-client'
import superagent from 'superagent'
import createClient from './index'

export default function (host, authService) {
  const defaultHeaders = authService.defaultHeaders()
  console.debug('REST client headers:', defaultHeaders)
  return createClient(rest(host).superagent(superagent), authService.auth)
}
