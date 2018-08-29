<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small)

    .q-pa-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.timelines.edit.title') }}
      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
            q-btn.q-mr-md.bg-grey-9(q-if="$route.params.id", slot="form-buttons-add", :label="exportLabel", @click="exportTimeline")
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
          q-btn.q-mr-md.bg-grey-9(:label="$t('buttons.update_access_control')", @click="updateACL")
      // .row
      //   .col-md-12
      //     tags(v-if="payload", :targetUuid="payload.uuid", fullWidth)
</template>

<script>
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'

  import { openURL } from 'quasar'

  export default {
    components: {
      FormMain,
      Tags
    },
    data () {
      const _this = this
      return {
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
      if (process.env.IS_STAGING) {
        const aclQuery = {role: 'public', uuid: this.$route.params.id, permission: 'get'}
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
          { id: this.$route.params.id },
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
      async setACL (action, role, uuid, permissions, recursive = false) {
        await this.$store.dispatch(action, { role, uuid, permissions })
        if (recursive) {
          const results = await this.$store.dispatch('annotations/find', { 'target.id': `${process.env.TIMELINE_BASE_URI}${uuid}` })
          for (let item of results.items) {
            await this.$store.dispatch(action, { role, uuid: item.uuid, permissions })
          }
        }
      },
      async updateACL () {
        console.debug('setting acl...', this.acl)
        if (this.acl.public) {
          await this.setACL('acl/set', 'public', this.$route.params.id, ['get'], this.acl.recursive)
        }
        else {
          await this.setACL('acl/remove', 'public', this.$route.params.id, 'get', this.acl.recursive)
        }
        if (this.acl.group) {
          await this.setACL('acl/set', this.acl.group, this.$route.params.id, ['get'], this.acl.recursive)
        }
        if (this.acl.group_remove) {
          await this.setACL('acl/remove', this.acl.group_remove, this.$route.params.id, 'get', this.acl.recursive)
        }
        this.$store.commit('notifications/addMessage', {
          body: 'messages.acl_updated',
          type: 'success'
        })
      }
    }
  }
</script>
