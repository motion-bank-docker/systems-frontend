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
      const { data } = await axios.get(`${process.env.API_HOST}/assets/${path}`, config)
      return data
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
