const globalSettings = {
  namespaced: true,
  state: {
    isMobile: undefined
  },
  getters: {
    getIsMobile: state => state.isMobile
  },
  mutations: {
    setIsMobile (state, val) {
      state.isMobile = val
    }
  }
}

export default globalSettings
