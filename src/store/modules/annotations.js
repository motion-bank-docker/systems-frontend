import axios from 'axios'
import * as jsonld from 'jsonld'
import { Annotation } from 'mbjs-data-models'
import parseURI from 'mbjs-data-models/src/lib/parse-uri'

const annotationsFactory = function (getRequestConfig) {
  const parseResponse = async response => {
    let { data } = response
    // FIXME: remove annotation type hack!
    data = data.map(item => {
      if (item['http://www.w3.org/ns/oa#hasBody']) item['@type'] = ['Annotation']
      return item
    })
    const ld = await jsonld.frame({
      '@context': 'https://www.w3.org/ns/anno.jsonld',
      '@graph': data
    }, {
      '@context': 'https://www.w3.org/ns/anno.jsonld',
      '@type': 'Annotation'
    })
    data = ld['@graph']
    const items = Array.isArray(data) ? data.map(item => {
      // FIXME: remove creator hack
      if (item['dc:creator']) item['creator'] = item['dc:creator']
      return new Annotation(item)
    }) : []
    return items
  }
  const annotations = {
    namespaced: true,
    state: {},
    actions: {
      async find (context, id) {
        const config = getRequestConfig()
        config.params = { media_url: id }
        config.headers['Accept'] = 'application/ld+json'
        const response = await axios.get(`${process.env.API_HOST}videos/annotations/`, config)
        const items = await parseResponse(response)
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
        const items = await parseResponse(response)
        console.debug('annotations/post', items)
        return items.length ? items[0] : undefined
      },
      async put (context, [id, payload]) {
        const config = getRequestConfig()
        config.headers['Accept'] = 'application/ld+json'
        config.headers['Content-Type'] = 'application/ld+json'
        const url = `${process.env.API_HOST}videos/annotations/${parseURI(id).id}/`
        const response = await axios.post(url, payload, config)
        console.debug('PUT', response)
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
