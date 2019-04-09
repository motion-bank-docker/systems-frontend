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
    scrollPosition: {x: 0, y: 0}
  },
  getters: {
    getOptions: state => state.options,
    getGroupAnnotationsBy: state => state.groupAnnotationsBy,
    getOptionsLaneMode: state => state.optionsLaneMode,
    getLaneMode: state => state.laneMode,
    getTimecode: state => state.timecode,
    getScaleFactor: state => state.scaleFactor,
    getScrollPosition: state => state.scrollPosition
  },
  mutations: {
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
      if (p.x) state.scrollPosition.x = p.x
      if (p.y) state.scrollPosition.y = p.y
    }
  }
}

export default swimLaneSettings
