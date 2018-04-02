/* global Primus */

import primus from '@feathersjs/primus-client'
import createClient from './index'

export default function (host, auth = undefined) {
  return createClient(primus(new Primus(host)), auth)
}
