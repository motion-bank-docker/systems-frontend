const axios = require('axios')

const mediaFactory = function (auth) {
  const getRequestConfig = auth => {
    return {
      headers: {
        Authorization: `${auth.tokenType} ${auth.token}`
      }
    }
  }
  const media = {
    namespaced: true,
    state: {
      entries: []
    },
    actions: {
      async find (context) {
        const response = await axios.get(`${process.env.API_HOST}videos/`, getRequestConfig(auth))
        const items = response.data.data ? response.data.data.map(item => {
          return {
            title: item.label,
            id: item.identifier,
            target: {
              id: item.urls.length ? item.urls[0] : undefined
            }
          }
        }) : []
        context.commit('setEntries', items)
        return items
      },
      async get (context, id) {
        if (!context.state.entries.length) await context.commit('find')
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
