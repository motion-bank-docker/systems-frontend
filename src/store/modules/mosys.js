const mosys = {
  namespaced: true,
  state: {
    sourcesTabName: '',
    showSources: false,
    showAddCells: false,
    showEditingCells: false,
    selectedCells: [],
    editingCells: [],
    scrollPositionCache: 0,
    editMode: undefined
  },
  getters: {
    getShowSources: state => state.showSources,
    getShowAddCells: state => state.showAddCells,
    getSelectedCells: state => state.selectedCells,
    getEditingCells: state => state.editingCells,
    getShowEditingCells: state => state.showEditingCells,
    getScrollPositionCache: state => state.scrollPositionCache,
    getEditMode: state => state.editMode
  },
  mutations: {
    setEditMode (state, mode) {
      state.editMode === mode ? state.editMode = undefined : state.editMode = mode
    },
    setEditingCells (state, cells) {
      state.editingCells = cells
      state.showEditingCells = cells.length > 0
      if (state.showEditingCells) {
        state.showSources = false
      }
    },
    setSelectedCells (state, cells) {
      state.selectedCells = cells
    },
    setSourcesTab (state, tabName) {
      state.sourcesTabName = tabName
    },
    showSources: (state) => {
      state.showSources = true
      if (state.showSources) {
        state.showEditingCells = false
      }
    },
    toggleSources: (state) => {
      state.showSources = !state.showSources
      if (state.showSources) {
        state.showEditingCells = false
        state.editingCells = []
      }
    },
    hideSources: (state) => {
      state.showSources = false
    },
    showAddCells: (state) => {
      state.showAddCells = true
      if (state.showAddCells) {
        state.showSources = false
      }
    },
    toggleAddCells: (state) => {
      state.showAddCells = !state.showAddCells
      if (state.showAddCells) {
        state.showSources = false
      }
    },
    hideAddCells: (state) => {
      state.showAddCells = false
    },
    showEditingCells: (state) => {
      state.showEditingCells = true
      if (state.showEditingCells) {
        state.showSources = false
      }
    },
    toggleEditingCells: (state) => {
      state.showEditingCells = !state.showEditingCells
      if (state.showEditingCells) {
        state.showSources = false
      }
      else {
        state.editingCells = []
      }
    },
    hideEditingCells: (state) => {
      state.showEditingCells = false
      state.editingCells = []
    },
    setScrollPositionCache: (state, p) => {
      state.scrollPositionCache = p
    }
  }
}

export default mosys
