const globalSettings = {
  namespaced: true,
  state: {
    isMobile: undefined,
    currentRoute: undefined
  },
  getters: {
    getIsMobile: state => state.isMobile,
    getCurrentRoute: state => state.currentRoute
  },
  mutations: {
    setIsMobile (state, val) {
      state.isMobile = val
    },
    setCurrentRoute (state, val) {
      state.currentRoute = val
    }
  }
}

export default globalSettings
