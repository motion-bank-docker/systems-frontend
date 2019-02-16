import axios from 'axios'
import { BASE_URI } from 'mbjs-data-models/src/constants'
import { Assert } from 'mbjs-utils'

const metadata = {
  namespaced: true,
  state: {
    cache: {}
  },
  mutations: {
    setCache (state, args) {
      if (args.length !== 2) throw new Error('metadata/setCache: Invalid arguments')
      state.cache[args[0]] = args[1]
    }
  },
  actions: {
    async get (context, payload) {
      Assert.ok(typeof payload === 'string' || typeof payload.body.source.id === 'string',
        'Metadata request payload must be UUID string or annotation object')
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      let metadataURL
      if (typeof payload === 'string') metadataURL = `${process.env.TRANSCODER_HOST}/metadata/${payload}`
      else metadataURL = `${process.env.TRANSCODER_HOST}/metadata/url?url=${encodeURIComponent(payload.body.source.id)}`
      let metadata
      metadata = context.state.cache[metadataURL] || metadata
      if (!metadata) {
        metadata = {}
        try {
          let result = await axios.get(metadataURL, {headers})
          metadata = result.data
          context.commit('setCache', [metadataURL, metadata])
        }
        catch (err) {
          if (!err.response || err.response.status > 404) console.error(err.message)
        }
      }
      const titleQuery = {
        'target.id': typeof payload === 'string' ? `${BASE_URI}/annotations/${payload}` : payload.id,
        'body.purpose': 'describing',
        'body.type': 'TextualBody'
      }
      const titleResult = await context.dispatch('annotations/find', titleQuery, {root: true})
      if (titleResult && titleResult.items && titleResult.items.length) {
        metadata.titleAnnotation = titleResult.items[0]
        if (metadata.title) metadata.originalTitle = metadata.title
        metadata.title = titleResult.items[0].body.value
      }
      console.debug('metadata', metadata)
      return metadata
    }
  }
}

export default metadata
