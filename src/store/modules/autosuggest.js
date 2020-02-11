import axios from 'axios'

const factory = function (env = {}) {
  const checkAuth = async context => {
    if (!env.auth.isAuthenticated) {
      await env.auth.authenticate(true, {
        dispatch: (name, args) => {
          context.dispatch(name, args, { root: true })
        }
      })
    }
  }
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
        await checkAuth(context)
        const config = env.getRequestConfig()
        config.params = { media_url: id, query }
        config.headers['Accept'] = 'application/ld+json'
        const { data } = await axios.get(`${process.env.API_HOST}autosuggest/annotations/`, config)
        return data
      },
      async getFilters (context) {
        if (!Object.keys(context.state.filters).length) {
          await checkAuth(context)
          const { data } = await axios.get(`${process.env.API_HOST}autosuggest/annotations/filters/`, env.getRequestConfig())
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
