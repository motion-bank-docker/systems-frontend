const mosys = {
  namespaced: true,
  state: {
    sourcesTabName: '',
    showSources: false,
    selectedCells: []
  },
  mutations: {
    setSelectedCells (state, cells) {
      state.selectedCells = cells
    },
    setSourcesTab (state, tabName) {
      state.sourcesTabName = tabName
    },
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

export default mosys
