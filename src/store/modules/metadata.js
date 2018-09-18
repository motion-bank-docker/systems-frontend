import axios from 'axios'

const metadata = {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async get (context, payload) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      let metadataURL
      if (typeof annotation === 'string') metadataURL = `${process.env.TRANSCODER_HOST}/metadata/${payload}`
      else metadataURL = `${process.env.TRANSCODER_HOST}/metadata/url?url=${encodeURIComponent(payload.body.source.id)}`
      let result = await axios.get(metadataURL, { headers })
      const metadata = result.data
      console.debug('metadata', metadata)
      return metadata
    }
  }
}

export default metadata
