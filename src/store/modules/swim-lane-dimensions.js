const swimLaneDimensions = {
  namespaced: true,
  state: {
    dimensions: {
      details: {
        height: {
          min: undefined,
          current: undefined,
          max: undefined
        },
        width: {
          min: 5,
          current: undefined,
          max: 50
        }
      },
      swimlanes: {
        height: {
          min: undefined,
          current: undefined,
          max: undefined
        },
        width: {
          min: undefined,
          current: 100,
          max: 100
        }
      }
    }
  },
  getters: {
    getDimensions: state => state.dimensions
  },
  mutations: {
  }
}

export default swimLaneDimensions
