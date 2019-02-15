<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'documents.list' })", icon="keyboard_backspace", round, small)

    h5.caption(dark) {{ $t('routes.documents.edit.title') }}
    .row(v-if="availableRoles.length")
      .col-md-12
        h5.caption.text-light {{ $t('labels.access_control') }}
        p {{ $t('descriptions.access_control_documents') }}
      .col-md-12.q-mb-md
        q-field(dark)
          q-checkbox(v-model="acl.public", :label="$t('labels.public')", dark)
      .col-md-12.q-mb-md
        q-field(orientation="vertical", dark)
          q-select(v-model="acl.group", :clearable="true", :clear-value="undefined",
          :float-label="$t('labels.access_control_add_group')", :options="availableRoles", dark)
      .col-md-12.q-mb-md
        q-field(orientation="vertical", dark)
          q-select(v-model="acl.group_remove", :clearable="true", :clear-value="undefined",
          :float-label="$t('labels.access_control_remove_group')", :options="availableRoles", dark)
      <!--.col-md-12.q-mb-md-->
        <!--q-field(dark)-->
          <!--q-checkbox(v-model="acl.recursive", :label="$t('labels.recursive')", dark)-->
      .row.xs-gutter.full-width.justify-end.items-end
        q-btn(:label="$t('buttons.update_access_control')", @click="updateACL", color="grey")
</template>

<script>
  import { mapGetters } from 'vuex'
  import { ObjectUtil } from 'mbjs-utils'

  export default {
    data () {
      return {
        acl: {
          public: false,
          group: undefined,
          group_remove: undefined,
          recursive: false
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      availableRoles () {
        try {
          const roles = this.user[`${process.env.AUTH0_APP_METADATA_PREFIX}roles`]
            .filter(role => role !== 'user')
          return roles.sort().map(role => { return { label: role, value: role } })
        }
        catch (e) {
          return []
        }
      },
      resourceName () {
        return ObjectUtil.uuid5(`${this.$route.params.bucket}/${this.$route.params.asset}`)
      }
    },
    async mounted () {
      const aclQuery = {role: 'public', uuid: this.resourceName, permission: 'get'}
      const permissions = await this.$store.dispatch('acl/isRoleAllowed', aclQuery)
      this.acl.public = permissions.get === true
    },
    methods: {
      async setACL (action, payload, recursive = false) {
        await this.$store.dispatch(action, payload)
        if (recursive) {
          // TODO: add recursion to asset ACL
          throw new Error('Recursion not implemented')
        }
      },
      async updateACL () {
        this.$q.loading.show()
        console.debug('setting acl...', this.acl, this.resourceName)
        if (this.acl.public) {
          await this.setACL('acl/set', { role: 'public', uuid: this.resourceName, id: this.resourceName, permissions: ['get'] }, this.acl.recursive)
        }
        else {
          await this.setACL('acl/remove', { role: 'public', uuid: this.resourceName, id: this.resourceName, permission: 'get' }, this.acl.recursive)
        }
        if (this.acl.group) {
          await this.setACL('acl/set', { role: this.acl.group, uuid: this.resourceName, id: this.resourceName, permissions: ['get'] }, this.acl.recursive)
        }
        if (this.acl.group_remove) {
          await this.setACL('acl/remove', { role: this.acl.group_remove, uuid: this.resourceName, id: this.resourceName, permission: 'get' }, this.acl.recursive)
        }
        this.$q.loading.hide()
        this.$store.commit('notifications/addMessage', {
          body: 'messages.acl_updated',
          type: 'success'
        })
      }
    }
  }
</script>
