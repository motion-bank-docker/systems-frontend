import constants from 'mbjs-data-models/src/constants'

const mosys = {
  namespaced: true,
  state: {
    sourcesTabName: '',
    showSources: false,
    // showAddCells: false,
    showEditingCells: false,
    // selectedCells: [],
    editingCells: [],
    editingCell: undefined,
    updatedCell: undefined,
    newCell: undefined,
    editCellModal: false,
    currentTimeline: undefined,
    sourceCellInput: undefined,
    mayEdit: false,

    editGrid: false,
    dimensions: {},
    currentScrollConfig: {
      id: undefined,
      offset: undefined
    }
  },
  getters: {
    getUpdatedCell: state => state.updatedCell,
    getMayEdit: state => state.mayEdit,
    getEditGrid: state => state.editGrid,
    getSourceCellInput: state => state.sourceCellInput,
    getNewCell: state => state.newCell,
    getShowSources: state => state.showSources,
    // getShowAddCells: state => state.showAddCells,
    // getSelectedCells: state => state.selectedCells,
    getEditingCell: state => state.editingCell,
    getEditingCells: state => state.editingCells,
    getShowEditingCells: state => state.showEditingCells,
    getEditCellModal: state => state.editCellModal,
    getCurrentTimeline: state => state.currentTimeline
  },
  mutations: {
    setUpdatedCell (state, value) {
      state.updatedCell = value
    },
    setMayEdit (state, value) {
      state.mayEdit = value
    },
    toggleGridEdit (state) {
      state.editGrid = !state.editGrid
    },
    setSourceCellInput (state, value) {
      state.sourceCellInput = value
    },
    setCurrentTimeline (state, obj) {
      state.currentTimeline = obj
    },
    setEditCellModal (state, visibility) {
      state.editCellModal = visibility
      if (!visibility) state.editingCell = undefined
    },
    cacheNewCell (state, cell) {
      state.newCell = cell
    },
    setEditingCell (state, cell) {
      if (state.editingCell === cell) {
        state.editingCell = undefined
        state.showEditingCells = false
      }
      else {
        state.editingCell = cell
        state.showEditingCells = true
      }
      /*
      state.showEditingCells = cells.length > 0
      if (state.showEditingCells) {
        state.showSources = false
      }
      */
    },
    /*
    setEditingCells (state, cells) {
      state.editingCells = cells
      state.showEditingCells = cells.length > 0
      if (state.showEditingCells) {
        state.showSources = false
      }
    },
    */
    /*
    setSelectedCells (state, cells) {
      state.selectedCells = cells
    },
    */
    setSourcesTab (state, tabName) {
      state.sourcesTabName = tabName
    },
    showSources: (state) => {
      state.showSources = true
      if (state.showSources) {
        state.showEditingCells = false
      }
    },
    toggleSources: (state, val) => {
      if (!val) state.showSources = !state.showSources
      else state.showSources = false
      if (state.showSources) {
        state.showEditingCells = false
        state.editingCells = []
      }
    },
    hideSources: (state) => {
      state.showSources = false
    },
    /*
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
    }, */
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
    setScrollConfig (state, [id, offset]) {
      state.currentScrollConfig.id = id
      state.currentScrollConfig.offset = offset
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
          'body.type': `${constants.BASE_URI_NS}cell.jsonld`
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
