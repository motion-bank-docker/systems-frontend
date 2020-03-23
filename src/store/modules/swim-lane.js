const swimLane = {
  namespaced: true,
  state: {
    groupAnnotationsBy: localStorage.getItem('mb_sl_groupAnnotationsBy') || 'type',
    options: [
      {label: 'Type', value: 'type'},
      {label: 'Creator', value: 'creator'}
    ],
    laneMode: localStorage.getItem('mb_sl_laneMode') || 'collapse',
    optionsLaneMode: [
      {label: 'Collapse', value: 'collapse'},
      {label: 'Expand', value: 'expand'}
    ],
    timecode: 0,
    scaleFactor: 1,
    scrollPosition: {x: 0, y: 0},
    visibilityDetails: JSON.parse(localStorage.getItem('mb_sl_visibilityDetails') || 'false'),
    detailsWidth: JSON.parse(localStorage.getItem('mb_sl_detailsWidth') || '20'),
    timecodeLabelBreakpoint: false,
    selectedAnnotation: undefined,
    visibilityDrawer: JSON.parse(localStorage.getItem('mb_sl_visibilityDrawer') || 'true'),
    cursorTop: undefined,
    visibilitySwimlanes: JSON.parse(localStorage.getItem('mb_sl_visibilitySwimlanes') || 'false'),
    expandedMode: JSON.parse(localStorage.getItem('mb_sl_expandedMode') || 'false')
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
    getTimecodeLabelBreakpoint: state => state.timecodeLabelBreakpoint,
    getSelectedAnnotation: state => state.selectedAnnotation,
    getVisibilityDrawer: state => state.visibilityDrawer,
    getCursorTop: state => state.cursorTop,
    getVisibilitySwimlanes: state => state.visibilitySwimlanes,
    getExpandedMode: state => state.expandedMode
  },
  mutations: {
    setExpandedMode (state) {
      state.expandedMode = !state.expandedMode
      localStorage.setItem('mb_sl_visibilitySwimlanes', JSON.stringify(state.expandedMode))
    },
    setVisibilitySwimlanes (state) {
      state.visibilitySwimlanes = !state.visibilitySwimlanes
      localStorage.setItem('mb_sl_visibilitySwimlanes', JSON.stringify(state.visibilitySwimlanes))
    },
    setCursorTop (state, val) {
      state.cursorTop = val
    },
    setVisibilityDrawer (state) {
      state.visibilityDrawer = !state.visibilityDrawer
      localStorage.setItem('mb_sl_visibilityDrawer', JSON.stringify(state.visibilityDrawer))
    },
    setSelectedAnnotation (state, val) {
      state.selectedAnnotation = val
    },
    setDetailsWidth (state, val) {
      state.detailsWidth = val
      localStorage.setItem('mb_sl_detailsWidth', JSON.stringify(state.detailsWidth))
    },
    setTimecodeLabelBreakpoint (state, val) {
      state.timecodeLabelBreakpoint = val
    },
    setVisibilityDetails (state) {
      state.visibilityDetails = !state.visibilityDetails
      localStorage.setItem('mb_sl_visibilityDetails', JSON.stringify(state.visibilityDetails))
    },
    setType (state, type) {
      state.groupAnnotationsBy = type
      localStorage.setItem('mb_sl_groupAnnotationsBy', JSON.stringify(state.groupAnnotationsBy))
    },
    setLaneMode (state, mode) {
      state.laneMode = mode
      localStorage.setItem('mb_sl_laneMode', JSON.stringify(state.laneMode))
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

export default swimLane
