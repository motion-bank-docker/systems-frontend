/* global Primus */

import primus from '@feathersjs/primus-client'
import auth from '@feathersjs/authentication-client'

import createClient from './index'

export default function (host) {
  return createClient(
    primus(new Primus(host)),
    auth({
      storage: window.localStorage
    })
  )
}
