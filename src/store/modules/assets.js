import axios from 'axios'

const assets = {
  namespaced: true,
  state: {
    assets: []
  },
  actions: {
    async list (context, bucketName) {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
      let result
      try {
        result = await axios.get(`${process.env.ASSETS_HOST}/assets/${bucketName}`, config)
        return result.data
      }
      catch (err) {
        return []
      }
    },
    async delete (context, [bucketName, assetName]) {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
      await axios.delete(`${process.env.ASSETS_HOST}/assets/${bucketName}/${assetName}`, config)
    }
  }
}

export default assets
