import constants from 'mbjs-data-models/src/constants'

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
    newCell: undefined,
    editCellModal: false,
    currentTimeline: undefined,
    sourceCellInput: undefined,

    dimensions: {}
  },
  getters: {
    getSourceCellInput: state => state.sourceCellInput,
    getNewCell: state => state.newCell,
    getShowSources: state => state.showSources,
    getShowAddCells: state => state.showAddCells,
    getSelectedCells: state => state.selectedCells,
    getEditingCells: state => state.editingCells,
    getShowEditingCells: state => state.showEditingCells,
    getScrollPositionCache: state => state.scrollPositionCache,
    getEditCellModal: state => state.editCellModal,
    getCurrentTimeline: state => state.currentTimeline
  },
  mutations: {
    setSourceCellInput (state, value) {
      state.sourceCellInput = value
    },
    setCurrentTimeline (state, obj) {
      state.currentTimeline = obj
    },
    setEditCellModal (state, visibility) {
      state.editCellModal = visibility
    },
    cacheNewCell (state, cell) {
      state.newCell = cell
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
  },
  actions: {
    async getGrid (context, id) {
      const grid = await context.dispatch('maps/get', id, { root: true })
      if (!grid.configuration || (!grid.configuration.value && !grid.configuration.id)) {
        grid.configuration = {
          value: {
            columns: 10,
            rows: 6,
            ratio: 16 / 9.0
          }
        }
        console.debug('Grid configuration initialised with', grid.configuration._value)
        await context.dispatch('updateGridMetadataStore', [grid, grid.configuration._value])
      }
      const
        query = {
          'target.id': grid.id,
          'body.purpose': 'linking',
          'body.type': `${constants.BASE_URI_TERMS}Cell`
        },
        { items } = await context.dispatch('annotations/find', query, { root: true }),
        annotations = items

      console.debug('Grid loaded', id, grid, annotations)
      return { grid, annotations, configuration: Object.assign({}, grid.configuration._value) }
    },
    async updateGridMetadataStore (context, [grid, configuration]) {
      grid.configuration.value = configuration
      await context.dispatch('maps/patch', [grid.id, { configuration: grid.configuration }], { root: true })
    }
  }
}

export default mosys
