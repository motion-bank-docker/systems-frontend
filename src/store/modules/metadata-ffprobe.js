import { BASE_URI } from 'mbjs-data-models/src/constants'
import { Assert } from 'mbjs-utils'
import getMetaData from 'mbjs-media/src/util/get-metadata'
import guessType from 'mbjs-media/src/util/guess-type'

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
      let metadata
      metadata = context.state.cache[payload.id || payload] || metadata
      // const { ipcRenderer } = require('electron')
      const { getGlobal } = require('electron').remote
      if (!metadata) {
        if (typeof payload !== 'string' && !payload.body.source.type) {
          payload.body.source.type = guessType(payload.body.source.id)
        }
        // metadata = ipcRenderer.sendSync('ffprobe', payload)
        const ffprobePath = getGlobal('FFPROBE_PATH')
        try {
          metadata = await getMetaData(payload, undefined, {
            youtube: process.env.YOUTUBE_API_KEY,
            vimeo: process.env.VIMEO_ACCESS_TOKEN
          }, { ffprobePath })
        }
        catch (err) {
          if (err.message.indexOf('ffprobe') > -1) {
            throw new Error(`${ffprobePath}: ${err.message}`)
          }
          else throw err
        }
      }
      if (typeof payload === 'string' || payload.id) {
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
      }
      console.debug('metadata', metadata)
      return metadata
    },
    // async get (context, payload) {
    //   Assert.ok(typeof payload === 'string' || typeof payload.body.source.id === 'string',
    //     'Metadata request payload must be UUID string or annotation object')
    //
    //   const { getGlobal } = require('electron').remote
    //
    //   let annotation = payload
    //   if (typeof payload === 'string') {
    //     try {
    //       annotation = await context.dispatch('annotations/get', payload, { root: true })
    //     }
    //     catch (e) {
    //       console.error('Metadata error', e)
    //     }
    //   }
    //
    //   console.log('annotation', payload, annotation)
    //
    //   const metadata = await getMetaData(annotation, async query => {
    //     const results = await context.dispatch('annotations/find', query, { root: true })
    //     return results
    //   }, {
    //     youtube: process.env.YOUTUBE_API_KEY,
    //     vimeo: process.env.VIMEO_ACCESS_TOKEN
    //   }, {
    //     ffprobePath: getGlobal('FFPROBE_PATH')
    //   })
    //
    //   console.log('metadata', metadata)
    //
    //   const titleQuery = {
    //     'target.id': typeof payload === 'string' ? `${BASE_URI}/annotations/${payload}` : annotation.id,
    //     'body.purpose': 'describing',
    //     'body.type': 'TextualBody'
    //   }
    //   const titleResult = await context.dispatch('annotations/find', titleQuery, {root: true})
    //   if (titleResult && titleResult.items && titleResult.items.length) {
    //     metadata.titleAnnotation = titleResult.items[0]
    //     if (metadata.title) metadata.originalTitle = metadata.title
    //     metadata.title = titleResult.items[0].body.value
    //   }
    //   console.log('final md', metadata)
    //   return metadata
    // },
    async getLocal (context, payload) {
      Assert.ok(typeof payload === 'string' || typeof payload.body.source.id === 'string',
        'Metadata request payload must be UUID string or annotation object')

      let metadataURL
      if (typeof payload === 'string') metadataURL = `${process.env.TRANSCODER_HOST}/metadata/${payload}`
      else metadataURL = `${process.env.TRANSCODER_HOST}/metadata/url?url=${encodeURIComponent(payload.body.source.id)}`
      let metadata
      metadata = context.state.cache[metadataURL] || {}
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
