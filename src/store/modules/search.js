const axios = require('axios')

const search = {
  namespaced: true,
  state: {},
  actions: {
    async query (context, { index, query, aggs }) {
      const config = {
        headers: {
          Authorization: `${this.$router.app.$auth.tokenType} ${this.$router.app.$auth.token}`
        }
      }
      let result = await axios.post(`${process.env.API_HOST}/search/${index}`, { query, aggs }, config)
      return result.data
    }
  }
}

export default search
