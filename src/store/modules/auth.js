// const sift = require('sift')
import { ObjectUtil, Assert } from 'mbjs-utils'

export default {
  namespaced: true,
  state: {
    user: undefined,
    redirectTo: localStorage.getItem('redirectTo') ? JSON.parse(localStorage.getItem('redirectTo')) : undefined
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
      Assert.isType(target, 'object', 'redirect target must be object')
      state.redirectTo = target
      localStorage.setItem('redirectTo', JSON.stringify(target))
    },
    clearRedirect: (state) => {
      state.redirectTo = undefined
      localStorage.removeItem('redirectTo')
    }
  }
}
