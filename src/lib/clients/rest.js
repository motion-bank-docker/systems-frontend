import rest from '@feathersjs/rest-client'
import superagent from 'superagent'
import createClient from './index'

export default function (host, mBAuth) {
  const defaultHeaders = mBAuth.defaultHeaders()
  console.debug('REST client headers:', defaultHeaders, mBAuth.auth)
  return createClient(rest(host).superagent(superagent), mBAuth.auth)
}
