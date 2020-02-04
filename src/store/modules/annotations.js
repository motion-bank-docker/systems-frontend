import axios from 'axios'
import * as jsonld from 'jsonld'
import { Annotation } from 'mbjs-data-models'

const annotationsFactory = function (getRequestConfig) {
  const annotations = {
    namespaced: true,
    state: {
      entries: []
    },
    actions: {
      async find (context, id) {
        const config = getRequestConfig()
        config.params = { media_url: id }
        config.headers['Accept'] = 'application/ld+json'
        let { data } = await axios.get(`${process.env.API_HOST}videos/annotations/`, config)
        // FIXME: remove annotation type hack!
        data = data.map(item => {
          if (item['http://www.w3.org/ns/oa#hasBody']) item['@type'] = ['Annotation']
          return item
        })
        const ld = await jsonld.frame({
          '@context': 'http://www.w3.org/ns/anno.jsonld',
          '@graph': data
        }, {
          '@context': 'http://www.w3.org/ns/anno.jsonld',
          '@type': 'Annotation'
        })
        console.debug('annotations/find', ld)
        data = ld['@graph']
        const items = Array.isArray(data) ? data.map(item => {
          // FIXME: remove creator hack
          if (item['dc:creator']) item['creator'] = item['dc:creator']
          return new Annotation(item)
        }) : []
        context.commit('setEntries', items)
        return items
      },
      async get (context, id) {
        if (!context.state.entries.length) await context.dispatch('find')
        return context.state.entries.find(entry => entry.id === id)
      },
      async post (context, payload) {
        const config = getRequestConfig()
        config.params = { media_url: payload.target.id, format: 'json-ld' }
        const response = await axios.post(`${process.env.API_HOST}videos/annotations/`,
          payload.toObject(), config)
        console.debug('annotations/post', response)
        return response.data
      },
      async delete (context, id) {
        const config = getRequestConfig()
        try {
          const url = new URL(id)
          const parts = url.pathname.split('/')
          id = parts.pop()
        }
        catch (err) { /* id isn't a URI */ }
        const response = await axios.delete(`${process.env.API_HOST}videos/annotations/${id}`, config)
        console.debug('annotations/delete', response)
        return response.data
      }
    },
    mutations: {
      setEntries (state, entries) {
        console.debug('setEntries', entries)
        state.entries = entries
      }
    }
  }
  return annotations
}

export default annotationsFactory
