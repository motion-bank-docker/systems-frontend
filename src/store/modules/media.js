const axios = require('axios')
const parseURI = require('mbjs-data-models/src/lib/parse-uri')
const { Annotation } = require('mbjs-data-models')

const mediaFactory = function (env = {}) {
  const checkAuth = async context => {
    if (!env.auth.isAuthenticated) {
      await env.auth.authenticate(true, {
        dispatch: (name, args) => {
          context.dispatch(name, args, { root: true })
        }
      })
    }
  }
  const createMediaAnnotation = item => {
    return new Annotation({
      title: item.label,
      id: item.url,
      body: {
        type: 'Video',
        source: {
          id: item.data.length ? item.data[0].url : undefined,
          type: 'video/mp4'
        }
      },
      target: {
        id: item.url,
        selector: {
          type: 'FragmentSelector',
          value: {
            t: [0, item.data.length ? item.data[0].duration : 0]
          }
        }
      }
    })
  }
  const media = {
    namespaced: true,
    state: {},
    actions: {
      async find (context, query = undefined) {
        await checkAuth(context)
        const requestConfig = env.getRequestConfig()
        requestConfig.params = { query }
        const response = await axios.get(`${process.env.API_HOST}videos/`, requestConfig)
        const items = response.data.hits ? response.data.hits.map(item => {
          return createMediaAnnotation(item)
        }) : []
        return items
      },
      async get (context, id) {
        await checkAuth(context)
        const { data } = await axios.get(`${process.env.API_HOST}videos/${parseURI(id).id}/`, env.getRequestConfig())
        return createMediaAnnotation(data)
      }
    }
  }
  return media
}

export default mediaFactory
