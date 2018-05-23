import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'
import axios from 'axios'

import createClient from './index'

export default function (host) {
  return createClient(
    rest(host).axios(axios),
    auth({
      storage: window.localStorage,
      storageKey: 'access_token'
    })
  )
}
