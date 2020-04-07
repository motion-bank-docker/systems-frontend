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
        `${process.env.API_HOST}/acl${query}`,
        permissions,
        { headers: getAuthHeaders(this) }
        )
    },
    async remove (context, { role, id, permission }) {
      const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(id)}` +
        `&permission=${encodeURIComponent(permission)}`
      await axios.delete(
        `${process.env.API_HOST}/acl${query}`,
        { headers: getAuthHeaders(this) })
    },
    async isRoleAllowed (context, { role, id, permission }) {
      const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(id)}` +
        `&permission=${encodeURIComponent(permission)}`
      const { data } = await axios.get(
        `${process.env.API_HOST}/acl${query}`,
        { headers: getAuthHeaders(this) })
      return data
    }
  }
}

export default acl
