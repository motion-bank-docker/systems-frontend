import rest from '@feathersjs/rest-client'
// import auth from '@feathersjs/authentication-client'
import request from 'request'

import createClient from './index'

export default function (host) {
  const requestClient = request.defaults({
    headers: {
      Authorization: localStorage.getItem('access_token')
    }
  })
  return createClient(
    // rest(host).axios(axios)
    rest(host).request(requestClient)
    /*
    auth({
      storage: window.localStorage,
      storageKey: 'access_token'
    })
    */
  )
}
