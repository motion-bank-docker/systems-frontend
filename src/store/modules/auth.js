// const sift = require('sift')
import { ObjectUtil, Assert } from 'mbjs-utils'

export default {
  namespaced: true,
  state: {
    user: undefined,
    redirectTo: localStorage.getItem('redirectTo') ? localStorage.getItem('redirectTo') : undefined
  },
  getters: {
    getUserState: state => state.user
  },
  mutations: {
    setUser: (state, user) => {
      if (user) {
        Assert.isType(user.sub || user.id, 'string', 'ID missing in user object')
        user.uuid = user.uuid || ObjectUtil.uuid5(user.sub || user.id)
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
