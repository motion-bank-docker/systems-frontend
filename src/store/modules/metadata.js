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
      if (typeof payload === 'string') {
        payload = await context.dispatch('annotations/get', payload, { root: true })
      }
      let metadata
      metadata = context.state.cache[payload.body.source.id] || metadata
      if (!metadata) {
        metadata = {}
        try {
          const result = await new Promise((resolve, reject) => {
            if (!this.$router.app.$socket) throw new Error('Metadata: Socket is not available')
            this.$router.app.$socket.emit(
              'metadata:get',
              { url: payload.body.source.id, token: localStorage.getItem('access_token') },
              (err, data) => {
                if (err) reject(err)
                else resolve(data)
              }
            )
          })
          if (result) {
            metadata = result
            context.commit('setCache', [payload.body.source.id, metadata])
          }
        }
        catch (err) {
          if (!err.response || err.response.status > 404) console.error(err.message)
        }
      }
      if (payload.id) {
        metadata = await context.dispatch('fetchTitle', [metadata, payload])
      }
      console.debug('metadata/get', metadata)
      return metadata
    },
    async getLocal (context, payload) {
      Assert.ok(typeof payload === 'string' || typeof payload.body.source.id === 'string',
        'Metadata request payload must be UUID string or annotation object')

      if (typeof payload === 'string') {
        payload = await context.dispatch('annotations/get', payload, { root: true })
      }
      let metadata = context.state.cache[payload.body.source.id] || {}
      metadata = await context.dispatch('fetchTitle', [metadata, payload])
      console.debug('metadata/getLocal', metadata)
      return metadata
    },
    async fetchTitle (context, [metadata, payload]) {
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
      console.debug('metadata/fetchTitle', metadata)
      return metadata
    }
  }
}

export default metadata
