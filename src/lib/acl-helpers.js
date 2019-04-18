import { ObjectUtil } from 'mbjs-utils'

class ACLHelpers {
  static async setACL (context, action, payload, recursive = false) {
    await context.$store.dispatch(action, payload)
    if (recursive) {
      const results = await context.$store.dispatch('annotations/find', { 'target.id': payload.id })
      for (let item of results.items) {
        if (item.author.id === context.$store.state.auth.user.uuid) {
          const itemPayload = ObjectUtil.merge({}, payload)
          itemPayload._uuid = item._uuid
          await context.$store.dispatch(action, itemPayload)
        }
      }
    }
  }

  static async updateACL (context) {
    console.debug('setting acl...', context.acl)
    if (this.acl.public) {
      await this.setACL('acl/set', { role: 'public', uuid: context.timeline._uuid, permissions: ['get'] }, context.acl.recursive)
    }
    else {
      await this.setACL('acl/remove', { role: 'public', uuid: context.timeline._uuid, permission: 'get' }, context.acl.recursive)
    }
    if (this.acl.group) {
      await this.setACL('acl/set', { role: context.acl.group, uuid: context.timeline._uuid, permissions: ['get'] }, context.acl.recursive)
    }
    if (this.acl.group_remove) {
      await this.setACL('acl/remove', { role: context.acl.group_remove, uuid: context.timeline._uuid, permission: 'get' }, context.acl.recursive)
    }
    this.$store.commit('notifications/addMessage', {
      body: 'messages.acl_updated',
      type: 'success'
    })
  }
}

export default ACLHelpers
