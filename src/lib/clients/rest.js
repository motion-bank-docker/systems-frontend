import rest from '@feathersjs/rest-client'
import auth from '@feathersjs/authentication-client'
import superagent from 'superagent'

import createClient from './index'

export default function (host) {
  return createClient(
    rest(host).superagent(superagent),
    auth({
      storage: window.localStorage
    })
  )
}
