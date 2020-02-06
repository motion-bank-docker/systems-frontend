const axios = require('axios')
const parseURI = require('mbjs-data-models/src/lib/parse-uri')

const mediaFactory = function (getRequestConfig) {
  const media = {
    namespaced: true,
    state: {
      entries: []
    },
    actions: {
      async find (context, query = undefined) {
        const requestConfig = getRequestConfig()
        requestConfig.params = { query }
        const response = await axios.get(`${process.env.API_HOST}videos/`, requestConfig)
        const items = response.data.hits ? response.data.hits.map(item => {
          return {
            title: item.label,
            id: item.url,
            body: {
              type: 'Video',
              source: {
                id: item.data.length ? item.data[0].url : undefined,
                type: 'video/mp4'
              }
            }
          }
        }) : []
        context.commit('setEntries', items)
        return items
      },
      async get (context, id) {
        const { data } = await axios.get(`${process.env.API_HOST}videos/${parseURI(id).id}`, getRequestConfig())
        return {
          title: data.label,
          id: data.url,
          body: {
            type: 'Video',
            source: {
              id: data.data.length ? data.data[0].url : undefined,
              type: 'video/mp4'
            }
          }
        }
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
