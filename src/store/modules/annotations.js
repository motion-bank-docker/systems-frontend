import axios from 'axios'
// import * as jsonld from 'jsonld'
import { Annotation } from 'mbjs-data-models'

const jsonld = require('jsonld')

const annotationsFactory = function (auth) {
  const getRequestConfig = auth => {
    return {
      headers: {
        Authorization: `${auth.tokenType} ${auth.token}`
      }
    }
  }
  const annotations = {
    namespaced: true,
    state: {
      entries: []
    },
    actions: {
      async find (context, id) {
        const config = getRequestConfig(auth)
        config.params = { media_url: id }
        // config.headers['Accept-Type'] = 'application/ld+json'
        config.headers['Accept'] = 'application/ld+json'
        const { data } = await axios.get(`${process.env.API_HOST}videos/annotations/`, config)
        for (let item of data) {
          const ld = await jsonld.compact(item, 'http://www.w3.org/ns/anno.jsonld')
          console.debug('ld', item, ld)
        }
        const items = Array.isArray(data) ? data.map(item => {
          const annotation = new Annotation({
            id: `${process.env.API_HOST}videos/annotations/${item.identifier}`
          })
          return annotation
        }) : []
        context.commit('setEntries', items)
        return items
      },
      async get (context, id) {
        if (!context.state.entries.length) await context.dispatch('find')
        return context.state.entries.find(entry => entry.id === id)
      },
      async post (context, payload) {
        const config = getRequestConfig(auth)
        config.params = { media_url: payload.target.id, format: 'json-ld' }
        const response = await axios.post(`${process.env.API_HOST}videos/annotations/`,
          payload.toObject(), config)
        console.log('res', response)
        return response.data
      }
    },
    mutations: {
      setEntries (state, entries) {
        state.entries = entries
      }
    }
  }
  return annotations
}

export default annotationsFactory
