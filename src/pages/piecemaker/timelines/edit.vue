<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.timelines.list' })", icon="keyboard_backspace", round, small)

    .q-px-xl
      h5.caption.text-light(dark) {{ $t('routes.piecemaker.timelines.edit.title') }}

      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
            q-btn.q-mr-md.bg-grey-9(q-if="$route.params.id", slot="form-buttons-add", :label="exportLabel", @click="exportTimeline")

      .row(v-if="availableRoles.length")
        .col-md-12
          h5.caption.text-light {{ $t('labels.access_control') }}
        .col-md-12.q-mb-md
          <!--p {{ $t('labels.access_control_add_group') }}-->
          q-field(orientation="vertical", dark)
            q-select(v-model="acl.group", :clearable="true", :clear-value="undefined",
            :float-label="$t('labels.access_control_add_group')", :options="availableRoles", dark)
        .col-md-12.q-mb-md
          q-field(orientation="vertical", dark)
            q-select(v-model="acl.group_remove", :clearable="true", :clear-value="undefined",
            :float-label="$t('labels.access_control_remove_group')", :options="availableRoles", dark)
        .col-md-12.q-mb-md
          q-field(dark)
            q-checkbox(v-model="acl.recursive", :label="$t('labels.recursive')", dark)
        .row.xs-gutter.full-width.justify-end.items-end
          q-btn(:label="$t('buttons.update_access_control')", @click="updateACL", color="grey")
</template>

<script>
  import AccessControl from '../../../components/shared/partials/AccessControl'
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'

  import { ObjectUtil } from 'mbjs-utils'
  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'

  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'

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
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      availableRoles () {
        console.log(this.user)
        try {
          return this.user[`${process.env.AUTH0_APP_METADATA_PREFIX}roles`]
            .filter(role => role !== 'user')
            .map(role => { return { label: role, value: role } })
        }
        catch (e) {
          return []
        }
      }
    },
    methods: {
      async exportTimeline () {
        if (this.downloadURL) return openURL(this.downloadURL)
        this.$q.loading.show()
        try {
          const result = await this.$axios.post(
            `${process.env.API_HOST}/archives/maps`,
            {id: this.timeline.uuid},
            {
              headers: {
                Authorization: `Bearer ${localStorage.access_token}`
              }
            }
          )
          this.downloadURL = result.data
          this.exportLabel = this.$t('buttons.download_archive')
        }
        catch (err) {
          this.$handleError(this, err, 'errors.export_archive_failed')
        }
        this.$q.loading.hide()
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
        this.$q.loading.show()
        console.debug('setting acl...', this.acl)
        if (this.acl.public) {
          await this.setACL('acl/set', { role: 'public', uuid: this.timeline.uuid, id: this.timeline.id, permissions: ['get'] }, this.acl.recursive)
        }
        else {
          await this.setACL('acl/remove', { role: 'public', uuid: this.timeline.uuid, id: this.timeline.id, permission: 'get' }, this.acl.recursive)
        }
        if (this.acl.group) {
          await this.setACL('acl/set', { role: this.acl.group, uuid: this.timeline.uuid, id: this.timeline.id, permissions: ['get'] }, this.acl.recursive)
        }
        if (this.acl.group_remove) {
          await this.setACL('acl/remove', { role: this.acl.group_remove, uuid: this.timeline.uuid, id: this.timeline.id, permission: 'get' }, this.acl.recursive)
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
