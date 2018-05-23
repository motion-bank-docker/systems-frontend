import rest from '@feathersjs/rest-client'
// import auth from '@feathersjs/authentication-client'
import request from 'request'

import createClient from './index'

const requestClient = request.defaults({
  headers: {
    Authorization: localStorage.getItem('access_token')
  }
})

export default function (host) {
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
