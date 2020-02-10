import axios from 'axios'

const factory = function (getRequestConfig) {
  const autosuggest = {
    namespaced: true,
    state: {
      filters: {}
    },
    getters: {
      getTypes: state => state.filters.type ? state.filters.type.options : [],
      getKeys: state => Object.keys(state.filters)
    },
    actions: {
      async find (context, [id, query]) {
        if (!query || !query.length) query = '*'

        const config = getRequestConfig()
        config.params = { media_url: id, query }
        config.headers['Accept'] = 'application/ld+json'
        const { data } = await axios.get(`${process.env.API_HOST}autosuggest/annotations/`, config)
        return data
      },
      async getFilters (context) {
        if (!Object.keys(context.state.filters).length) {
          const { data } = await axios.get(`${process.env.API_HOST}autosuggest/annotations/filters/`, getRequestConfig())
          const filters = {}
          for (let item of data) {
            filters[item.key] = item
          }
          context.commit('setFilters', filters)
        }
        return context.state.filters
      }
    },
    mutations: {
      setFilters (state, filters) {
        state.filters = filters
      }
    }
  }
  return autosuggest
}

export default factory
