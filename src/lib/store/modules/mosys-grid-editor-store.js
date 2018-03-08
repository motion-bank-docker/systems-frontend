const mosysGridEditorStore = {
  namespaced: true,
  state: {
    showSources: false
  },
  mutations: {
    showSources: (state) => {
      state.showSources = true
    },
    toggleSources: (state) => {
      state.showSources = !state.showSources
    },
    hideSources: (state) => {
      state.showSources = false
    }
  }
}

export default mosysGridEditorStore
