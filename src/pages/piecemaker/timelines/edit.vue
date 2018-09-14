<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small)

    .q-px-xl
      h5.caption(dark) {{ $t('routes.piecemaker.timelines.edit.title') }}

      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
            q-btn.q-mr-md.bg-grey-9(q-if="$route.params.id", slot="form-buttons-add", :label="exportLabel", @click="exportTimeline")

      .row
        .col-md-12
          // access-control(:resource="timeline")

      .row(v-if="env.IS_STAGING")
        .col-md-12
          p {{ $t('labels.access_control') }}
          q-checkbox(v-model="acl.public", :label="$t('labels.access_control_public')", dark)
        .col-md-12
          p {{ $t('labels.access_control_add_group') }}
          q-input(v-model="acl.group", :label="$t('labels.access_control_add_group')", dark)
        .col-md-12
          p {{ $t('labels.access_control_remove_group') }}
          q-input(v-model="acl.group_remove", :label="$t('labels.access_control_remove_group')", dark)
        .col-md-12
          p {{ $t('labels.recursive') }}
          q-checkbox(v-model="acl.recursive", :label="$t('labels.recursive')", dark)
        .col-md-12
          q-btn.q-mr-md.bg-grey-9(:label="$t('buttons.update_access_control')", @click="updateACL")

      // .row
      //   .col-md-12
      //     tags(v-if="payload", :targetUuid="payload.uuid", fullWidth)
</template>

<script>
  import AccessControl from '../../../components/shared/partials/AccessControl'
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'

  import { ObjectUtil } from 'mbjs-utils'
  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'

  import { openURL } from 'quasar'

  export default {
    components: {
      AccessControl,
      FormMain,
      Tags
    },
    data () {
      const _this = this
      return {
        timeline: undefined,
        env: process.env,
        downloadURL: undefined,
        exportLabel: this.$t('buttons.export_timeline'),
        type: constants.MAP_TYPE_TIMELINE,
        payload: this.$route.params.id ? _this.$store.dispatch('maps/get', _this.$route.params.id) : undefined,
        acl: {
          public: false,
          group: undefined,
          group_remove: undefined,
          recursive: false
        },
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.timeline_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              return _this.$store.dispatch('maps/patch', [_this.payload.uuid, _this.payload])
                .then(() => _this.$router.push({ name: 'piecemaker.timelines.list' }))
            }
          }
        }
      }
    },
    async mounted () {
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.id)
      if (process.env.IS_STAGING) {
        const aclQuery = {role: 'public', id: this.timeline.id, permission: 'get'}
        const permissions = await this.$store.dispatch('acl/isRoleAllowed', aclQuery)
        this.acl.public = permissions.get === true
      }
    },
    methods: {
      exportTimeline () {
        const _this = this
        if (this.downloadURL) return openURL(this.downloadURL)
        this.$axios.post(
          `${process.env.API_HOST}/archives/maps`,
          { id: this.timeline.uuid },
          {
            headers: {
              Authorization: `Bearer ${localStorage.access_token}`
            }
          }
        ).then(result => {
          _this.downloadURL = `${process.env.API_HOST}/archives/maps/${result.data}`
          _this.exportLabel = _this.$t('buttons.download_archive')
        })
      },
      async setACL (action, payload, recursive = false) {
        await this.$store.dispatch(action, payload)
        if (recursive) {
          const results = await this.$store.dispatch('annotations/find', { 'target.id': payload.id })
          for (let item of results.items) {
            if (item.author.id === this.$store.state.auth.user.uuid) {
              const itemPayload = ObjectUtil.merge({}, payload)
              itemPayload.uuid = item.uuid
              await this.$store.dispatch(action, itemPayload)
            }
          }
        }
      },
      async updateACL () {
        console.debug('setting acl...', this.acl)
        if (this.acl.public) {
          await this.setACL('acl/set', { role: 'public', uuid: this.timeline.uuid, permissions: ['get'] }, this.acl.recursive)
        }
        else {
          await this.setACL('acl/remove', { role: 'public', uuid: this.timeline.uuid, permission: 'get' }, this.acl.recursive)
        }
        if (this.acl.group) {
          await this.setACL('acl/set', { role: this.acl.group, uuid: this.timeline.uuid, permissions: ['get'] }, this.acl.recursive)
        }
        if (this.acl.group_remove) {
          await this.setACL('acl/remove', { role: this.acl.group_remove, uuid: this.timeline.uuid, permission: 'get' }, this.acl.recursive)
        }
        this.$store.commit('notifications/addMessage', {
          body: 'messages.acl_updated',
          type: 'success'
        })
      }
    }
  }
</script>
