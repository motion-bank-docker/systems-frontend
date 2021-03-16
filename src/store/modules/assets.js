import axios from 'axios'

const assets = {
  namespaced: true,
  state: {},
  actions: {
    async find (context, path) {
      const config = {
        headers: {
          Authorization: `${this.$router.app.$auth.tokenType} ${this.$router.app.$auth.token}`
        }
      }
      return axios.get(`${process.env.API_HOST}/assets/${path}`, config).then(response => {
        return response.data
      }).catch(error => {
        console.debug(error.response)
        return null
      })
      // return data
    },
    async delete (context, path) {
      const config = {
        headers: {
          Authorization: `${this.$router.app.$auth.tokenType} ${this.$router.app.$auth.token}`
        }
      }
      await axios.delete(`${process.env.API_HOST}/assets/${path}`, config)
    }
  }
}

export default assets
