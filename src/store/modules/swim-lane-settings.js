const swimLaneSettings = {
  namespaced: true,
  state: {
    groupAnnotationsBy: 'type',
    options: [
      {label: 'Type', value: 'type'},
      {label: 'Author', value: 'author'}
    ],
    laneMode: 'collapse',
    optionsLaneMode: [
      {label: 'Collapse', value: 'collapse'},
      {label: 'Expand', value: 'expand'}
    ],
    timecode: 0,
    scaleFactor: 1,
    scrollPosition: {x: 0, y: 0},
    visibilityDetails: false,
    detailsWidth: 20,
    selectedAnnotation: undefined,
    visibilityDrawer: true,
    cursorTop: undefined,
    visibilitySwimlanes: undefined,
    expandedMode: false
  },
  getters: {
    getOptions: state => state.options,
    getGroupAnnotationsBy: state => state.groupAnnotationsBy,
    getOptionsLaneMode: state => state.optionsLaneMode,
    getLaneMode: state => state.laneMode,
    getTimecode: state => state.timecode,
    getScaleFactor: state => state.scaleFactor,
    getScrollPosition: state => state.scrollPosition,
    getVisibilityDetails: state => state.visibilityDetails,
    getDetailsWidth: state => state.detailsWidth,
    getSelectedAnnotation: state => state.selectedAnnotation,
    getVisibilityDrawer: state => state.visibilityDrawer,
    getCursorTop: state => state.cursorTop,
    getVisibilitySwimlanes: state => state.visibilitySwimlanes,
    getExpandedMode: state => state.expandedMode
  },
  mutations: {
    setExpandedMode (state) {
      state.expandedMode = !state.expandedMode
    },
    setVisibilitySwimlanes (state) {
      state.visibilitySwimlanes = !state.visibilitySwimlanes
    },
    setCursorTop (state, val) {
      state.cursorTop = val
    },
    setVisibilityDrawer (state) {
      state.visibilityDrawer = !state.visibilityDrawer
    },
    setSelectedAnnotation (state, val) {
      state.selectedAnnotation = val
    },
    setDetailsWidth (state, val) {
      state.detailsWidth = val
    },
    setVisibilityDetails (state) {
      state.visibilityDetails = !state.visibilityDetails
    },
    setType (state, type) {
      state.groupAnnotationsBy = type
    },
    setLaneMode (state, mode) {
      state.laneMode = mode
    },
    setTimecode (state, v) {
      state.timecode = v
    },
    setScaleFactor (state, v) {
      state.scaleFactor = v
    },
    setScrollPosition (state, p) {
      if (p.x !== null) state.scrollPosition.x = p.x
      if (p.y !== null) state.scrollPosition.y = p.y
    }
  }
}

export default swimLaneSettings
