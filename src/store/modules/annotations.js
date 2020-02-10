import axios from 'axios'
import { AnnotationFactory } from 'mbjs-data-models'
import parseURI from 'mbjs-data-models/src/lib/parse-uri'

const annotationsFactory = function (getRequestConfig) {
  const annotations = {
    namespaced: true,
    state: {},
    actions: {
      async find (context, id) {
        const config = getRequestConfig()
        config.params = { media_url: id }
        config.headers['Accept'] = 'application/ld+json'
        const response = await axios.get(`${process.env.API_HOST}videos/annotations/`, config)
        const items = await AnnotationFactory.fromFlatJsonLd(response.data)
        console.debug('annotations/find', items)
        return items
      },
      async get (context, id) {
        const config = getRequestConfig()
        config.headers['Accept'] = 'application/ld+json'
        if (!context.state.entries.length) await context.dispatch('find')
        return context.state.entries.find(entry => entry.id === id)
      },
      async post (context, payload) {
        const config = getRequestConfig()
        config.params = { media_url: payload.target.id, format: 'json-ld' }
        const response = await axios.post(`${process.env.API_HOST}videos/annotations/`,
          payload.toObject(), config)
        const items = await AnnotationFactory.fromFlatJsonLd(response.data)
        console.debug('annotations/post', items)
        return items.length ? items[0] : undefined
      },
      async put (context, [id, payload]) {
        const config = getRequestConfig()
        config.headers['Accept'] = 'application/ld+json'
        config.headers['Content-Type'] = 'application/ld+json'
        const url = `${process.env.API_HOST}videos/annotations/${parseURI(id).id}/`
        const response = await axios.post(url, payload.toObject(), config)
        console.debug('annotations/put', response)
        return response.data
      },
      async delete (context, id) {
        await axios.delete(`${process.env.API_HOST}videos/annotations/${parseURI(id).id}`, getRequestConfig())
      }
    }
  }
  return annotations
}

export default annotationsFactory
