import axios from 'axios'
import * as utils from 'mbjs-utils'

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
      if (!utils.uuid.isUUID(uuid)) {
        const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(uuid)}`
        await axios.put(`${process.env.API_HOST}/acl${query}`, permissions, { headers })
      }
      else await axios.put(`${process.env.API_HOST}/acl/${role}/${uuid}`, permissions, { headers })
    },
    async remove (context, { role, uuid, permission }) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      if (!utils.uuid.isUUID(uuid)) {
        const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(uuid)}&permission=${encodeURIComponent(permission)}`
        await axios.delete(`${process.env.API_HOST}/acl${query}`, { headers })
      }
      else await axios.delete(`${process.env.API_HOST}/acl/${role}/${uuid}/${permission}`, { headers })
    },
    async isRoleAllowed (context, { role, uuid, permission }) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
      let permissions
      if (!utils.uuid.isUUID(uuid)) {
        const query = `?role=${encodeURIComponent(role)}&resource=${encodeURIComponent(uuid)}&permission=${encodeURIComponent(permission)}`
        permissions = await axios.get(`${process.env.API_HOST}/acl${query}`, { headers })
      }
      else permissions = await axios.get(`${process.env.API_HOST}/acl/${role}/${uuid}/${permission}`, { headers })
      return permissions.data
    }
  }
}

export default acl
