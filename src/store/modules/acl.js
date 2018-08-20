import axios from 'axios'

const acl = {
  namespaced: true,
  state: {
    resources: []
  },
  actions: {
    async set (context, { role, uuid, permissions }) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      await axios.put(`${process.env.API_HOST}/acl/${role}/${uuid}`, permissions, { headers })
    },
    async remove (context, { role, uuid, permission }) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      await axios.delete(`${process.env.API_HOST}/acl/${role}/${uuid}/${permission}`, { headers })
    },
    async isRoleAllowed (context, { role, uuid, permission }) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      const permissions = await axios.get(`${process.env.API_HOST}/acl/${role}/${uuid}/${permission}`, { headers })
      return permissions.data
    }
  }
}

export default acl
