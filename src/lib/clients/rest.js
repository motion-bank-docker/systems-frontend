import rest from '@feathersjs/rest-client'
import superagent from 'superagent'
import createClient from './index'

export default function (host, authService = undefined) {
  const
    defaultHeaders = authService.defaultHeaders(),
    { auth } = authService
  console.log('REST client:', defaultHeaders)
  return createClient(rest(host).superagent(superagent), auth)
}
