const forms = {
  namespaced: true,
  state: {
    registration: null
  },
  mutations: {
    registration: (state, data) => {
      state.registration = data
    }
  }
}

export default forms
