import axios from 'axios'

const acl = {
  namespaced: true,
  state: {
    resources: []
  },
  actions: {
    async set (context, { role, id, permissions }) {
      const headers = {
        Authorization: `${this.$router.app.$auth.tokenType} ${this.$router.app.$auth.token}`
      }
      const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(id)}`
      await axios.put(`${process.env.API_HOST}/acl${query}`, permissions, { headers })
    },
    async remove (context, { role, id, permission }) {
      const headers = {
        Authorization: `${this.$router.app.$auth.tokenType} ${this.$router.app.$auth.token}`
      }
      const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(id)}` +
        `&permission=${encodeURIComponent(permission)}`
      await axios.delete(`${process.env.API_HOST}/acl${query}`, { headers })
    },
    async isRoleAllowed (context, { role, id, permission }) {
      const headers = {
        Authorization: `${this.$router.app.$auth.tokenType} ${this.$router.app.$auth.token}`
      }
      let permissions
      const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(id)}` +
        `&permission=${encodeURIComponent(permission)}`
      permissions = await axios.get(`${process.env.API_HOST}/acl${query}`, { headers })
      return permissions.data
    }
  }
}

export default acl
