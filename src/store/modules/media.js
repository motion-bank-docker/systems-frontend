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
          id: item.data && item.data.length ? item.data[0].url : undefined,
          type: 'video/mp4'
        }
      },
      target: {
        id: item.url,
        selector: {
          type: 'FragmentSelector',
          value: {
            t: item.data ? [0, item.data.length ? item.data[0].duration : 0] : undefined
          }
        }
      }
    })
  }
  const media = {
    namespaced: true,
    state: {},
    actions: {
      async find (context, [query = undefined, pagination = undefined]) {
        await checkAuth(context)
        const requestConfig = env.getRequestConfig()
        requestConfig.params = { query }
        if (pagination) {
          requestConfig.params.page = pagination.page
          requestConfig.params.page_size = pagination.rowsPerPage
          requestConfig.params.new_style = 1
        }
        const response = await axios.get(`${context.rootState.settings.apiHost}videos/`, requestConfig)
        const items = response.data.data ? response.data.data.map(item => {
          item.url = item.url || `${context.rootState.settings.apiHost}videos/${item.identifier}`
          return createMediaAnnotation(item)
        }) : []
        const rowsNumber = response.data.total ? response.data.total.value : undefined
        return {
          rows: items,
          rowsNumber,
          page: pagination.page,
          rowsPerPage: pagination.rowsPerPage
        }
      },
      async get (context, id) {
        await checkAuth(context)
        const { data } = await axios.get(`${context.rootState.settings.apiHost}videos/${parseURI(id).id}/`, Object.assign({
          params: {
            new_style: 1
          }
        }, env.getRequestConfig()))
        return {
          annotation: createMediaAnnotation(Object.assign({
            url: `${context.rootState.settings.apiHost}videos/${data.identifier}`
          }, data)),
          metadata: Array.isArray(data.data) && data.data.length ? data.data[0] : {}
        }
      }
    }
  }
  return media
}

export default mediaFactory
