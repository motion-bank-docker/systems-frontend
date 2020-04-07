import axios from 'axios'

const getAuthHeaders = function (context) {
  return {
    Authorization: `${context.$router.app.$auth.tokenType} ${context.$router.app.$auth.token}`
  }
}

const auth0 = {
  namespaced: true,
  state: {
    apiHost: process.env.API_HOST || window.API_HOST
  },
  actions: {
    async getUser (context, userId = undefined) {
      const { user } = this.$router.app.$auth
      const { data } = await axios.get(
        `${context.state.apiHost}/manage/${userId || user.sub}`,
        { headers: getAuthHeaders(this) })
      return data
    },

    async patchUserMetadata (context, [userId = undefined, metadata = {}]) {
      const { user } = this.$router.app.$auth
      const result = await axios.patch(
        `${context.state.apiHost}/manage/${userId || user.sub}`,
        { user_metadata: metadata },
        { headers: getAuthHeaders(this) })
      return result.data
    },

    async patchAppMetadata (context, [userId = undefined, metadata = {}]) {
      const { user } = this.$router.app.$auth
      const result = await axios.patch(
        `${context.state.apiHost}/manage/${userId || user.sub}`,
        { app_metadata: metadata },
        { headers: getAuthHeaders(this) })
      return result.data
    },

    async createUser (context, payload) {
      const { data } = await axios.post(
        `${context.state.apiHost}/manage`,
        payload,
        { headers: getAuthHeaders(this) })
      return data
    },

    async removeUser (context, userId = undefined) {
      const { user } = this.$router.app.$auth
      const { data } = await axios.delete(
        `${context.state.apiHost}/manage/${userId || user.sub}`,
        { headers: getAuthHeaders(this) })
      return data
    }
  }
}

export default auth0
