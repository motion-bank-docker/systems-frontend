import axios from 'axios'
import { AnnotationFactory } from 'mbjs-data-models'
import parseURI from 'mbjs-data-models/src/lib/parse-uri'

const annotationsFactory = function (env = {}) {
  const checkAuth = async context => {
    if (!env.auth.isAuthenticated) {
      await env.auth.authenticate(true, {
        dispatch: (name, args) => {
          context.dispatch(name, args, { root: true })
        }
      })
    }
  }
  const annotations = {
    namespaced: true,
    state: {},
    actions: {
      async find (context, id) {
        await checkAuth(context)
        const config = env.getRequestConfig()
        config.params = { media_url: id }
        config.headers['Accept'] = 'application/ld+json'
        const response = await axios.get(`${context.rootState.settings.apiHost}videos/annotations/`, config)
        const items = await AnnotationFactory.fromFlatJsonLd(response.data)
        console.debug('annotations/find', items)
        return items
      },
      async get (context, id) {
        await checkAuth(context)
        const config = env.getRequestConfig()
        config.headers['Accept'] = 'application/ld+json'
        if (!context.state.entries.length) await context.dispatch('find')
        return context.state.entries.find(entry => entry.id === id)
      },
      async post (context, payload) {
        await checkAuth(context)
        const config = env.getRequestConfig()
        config.params = { media_url: payload.target.id, format: 'json-ld' }
        if (typeof payload.toObject === 'function') payload = payload.toObject()
        const response = await axios.post(`${context.rootState.settings.apiHost}videos/annotations/`, payload, config)
        const items = await AnnotationFactory.fromFlatJsonLd(response.data)
        console.debug('annotations/post', items)
        return items.length ? items[0] : undefined
      },
      async patch (context, [id, payload]) {
        await checkAuth(context)
        const config = env.getRequestConfig()
        config.headers['Accept'] = 'application/ld+json'
        config.headers['Content-Type'] = 'application/ld+json'
        const url = `${context.rootState.settings.apiHost}videos/annotations/${parseURI(id).id}/`
        if (typeof payload.toObject === 'function') payload = payload.toObject()
        const response = await axios.patch(url, payload, config)
        const items = await AnnotationFactory.fromFlatJsonLd(response.data)
        console.debug('annotations/patch', items)
        return items.length ? items[0] : undefined
      },
      async delete (context, id) {
        await checkAuth(context)
        await axios.delete(`${context.rootState.settings.apiHost}videos/annotations/${parseURI(id).id}`, env.getRequestConfig())
      }
    }
  }
  return annotations
}

export default annotationsFactory
