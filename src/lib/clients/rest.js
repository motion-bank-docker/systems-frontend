import rest from '@feathersjs/rest-client'
import superagent from 'superagent'
import createClient from './index'

export default function (host, auth = undefined) {
  return createClient(rest(host).superagent(superagent), auth)
}
