import axios from 'axios'

const factory = function (getRequestConfig) {
  const autosuggest = {
    namespaced: true,
    state: {
      types: []
    },
    getters: {
      getTypes: state => state.types || []
    },
    actions: {
      async find (context, [id, query]) {
        const config = getRequestConfig()
        config.params = { media_url: id, query }
        config.headers['Accept'] = 'application/ld+json'
        const { data } = await axios.get(`${process.env.API_HOST}autosuggest/annotations/`, config)
        return data
      },
      async loadTypes (context, mediaUrl) {
        const objects = await context.dispatch('find', [mediaUrl, '*'])
        const types = objects.reduce((types, object) => {
          if (object.type && types.indexOf(object.type) === -1) types.push(object.type)
          return types
        }, []).map(t => {
          return { id: t, label: t }
        })
        context.commit('setTypes', types)
      }
    },
    mutations: {
      setTypes (state, types) {
        console.debug('setTypes', types)
        state.types = types
      }
    }
  }
  return autosuggest
}

export default factory
