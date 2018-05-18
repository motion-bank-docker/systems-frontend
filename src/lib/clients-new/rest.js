import rest from '@feathersjs/rest-client'
import axios from 'axios'
import createClient from './index'

export default function (host, mBAuth) {
  return createClient(rest(host).axios(axios), mBAuth.auth)
}
