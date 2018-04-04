import rest from '@feathersjs/rest-client'
import superagent from 'superagent'
import createClient from './index'

export default function (host, mBAuth) {
  return createClient(rest(host).superagent(superagent), mBAuth.auth)
}
