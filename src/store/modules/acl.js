import axios from 'axios'

const getAuthHeaders = function (context) {
  return {
    Authorization: `${context.$router.app.$auth.tokenType} ${context.$router.app.$auth.token}`
  }
}

const acl = {
  namespaced: true,
  state: {
    resources: []
  },
  actions: {
    async set (context, { role, id, permissions }) {
      const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(id)}`
      await axios.put(
        `${context.rootState.settings.apiHost}/acl${query}`,
        permissions,
        { headers: getAuthHeaders(this) }
        )
    },
    async remove (context, { role, id, permission }) {
      const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(id)}` +
        `&permission=${encodeURIComponent(permission)}`
      await axios.delete(
        `${context.rootState.settings.apiHost}/acl${query}`,
        { headers: getAuthHeaders(this) })
    },
    async isRoleAllowed (context, { role, id, permission }) {
      const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(id)}` +
        `&permission=${encodeURIComponent(permission)}`
      const { data } = await axios.get(
        `${context.rootState.settings.apiHost}/acl${query}`,
        { headers: getAuthHeaders(this) })
      return data
    }
  }
}

export default acl
