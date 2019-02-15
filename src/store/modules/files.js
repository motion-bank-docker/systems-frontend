import axios from 'axios'

const files = {
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
        result = await axios.get(`${process.env.STORAGE_HOST}/files/${bucketName}`, config)
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
      await axios.delete(`${process.env.STORAGE_HOST}/files/${bucketName}/${assetName}`, config)
    }
  }
}

export default files
