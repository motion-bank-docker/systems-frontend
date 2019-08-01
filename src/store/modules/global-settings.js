const globalSettings = {
  namespaced: true,
  state: {
    currentRoute: undefined
  },
  getters: {
    getCurrentRoute: state => state.currentRoute
  },
  mutations: {
    setCurrentRoute (state, val) {
      state.currentRoute = val
    }
  }
}

export default globalSettings
