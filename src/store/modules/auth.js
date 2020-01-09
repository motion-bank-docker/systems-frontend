// const sift = require('sift')
import { ObjectUtil, Assert } from 'mbjs-utils'

export default {
  namespaced: true,
  state: {
    user: undefined,
    redirectTo: localStorage.getItem('redirectTo') ? localStorage.getItem('redirectTo') : undefined,
    pba: {
      username: process.env.PBA_API_USER,
      password: process.env.PBA_API_PASS
    }
  },
  getters: {
    getUserState: state => state.user
  },
  mutations: {
    setUser: (state, user) => {
      if (user) {
        Assert.isType(user.sub, 'string', 'Auth0 ID missing in user object')
        user.uuid = ObjectUtil.uuid5(user.sub)
      }
      state.user = user
    },
    setRedirect: (state, target) => {
      Assert.isType(target, 'string', 'redirect target must be object')
      state.redirectTo = target
      localStorage.setItem('redirectTo', JSON.stringify(target))
    },
    clearRedirect: (state) => {
      state.redirectTo = undefined
      localStorage.removeItem('redirectTo')
    }
  }
}
