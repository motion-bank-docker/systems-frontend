const axios = require('axios')

const mediaFactory = function (getRequestConfig) {
  const media = {
    namespaced: true,
    state: {
      entries: []
    },
    actions: {
      async find (context) {
        const response = await axios.get(`${process.env.API_HOST}videos/`, getRequestConfig())
        const items = response.data.data ? response.data.data.map(item => {
          return {
            title: item.label,
            id: item.identifier,
            body: {
              type: 'Video',
              source: {
                id: item.urls.length ? item.urls[0] : undefined,
                type: 'video/mp4'
              }
            },
            target: {
              id: item.id
            }
          }
        }) : []
        context.commit('setEntries', items)
        return items
      },
      async get (context, id) {
        if (!context.state.entries.length) await context.dispatch('find')
        return context.state.entries.find(entry => entry.id === id)
      }
    },
    mutations: {
      setEntries (state, entries) {
        state.entries = entries
      }
    }
  }
  return media
}

export default mediaFactory
