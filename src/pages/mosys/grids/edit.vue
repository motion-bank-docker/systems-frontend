<template lang="pug">
  full-screen
    .q-px-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.mosys.grids.edit.title') }}

      .row
        .col-md-12
          form-main(v-model="payload", :schema="schema")
            q-btn.q-mr-md.bg-grey-9(q-if="$route.params.id && userHasPackager", slot="form-buttons-add",
              :label="packageLabel", @click="createPackage")

      .row(v-if="availableRoles.length")
        .col-md-12
          h5.caption.text-light {{ $t('labels.access_control') }}
          p {{ $t('descriptions.access_control') }}
        .col-md-12.q-mb-md
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

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'
  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'
  import { userHasFeature, aclHelper } from 'mbjs-quasar/src/lib'

  export default {
    components: {
      AccessControl,
      FormMain,
      Tags
    },
    data () {
      const _this = this
      return {
        grid: undefined,
        env: process.env,
        packageLabel: this.$t('buttons.create_package'),
        downloadURL: undefined,
        acl: {
          group: undefined,
          group_remove: undefined,
          recursive: false
        },
        type: constants.MAP_TYPE_2D_GRID,
        payload: this.$route.params.id ? _this.$store.dispatch('maps/get', _this.$route.params.id) : undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.grid_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              return _this.$store.dispatch('maps/patch', [_this.payload.uuid, _this.payload])
                .then(() => _this.$router.push({ name: 'mosys.grids.list' }))
            }
          }
        }
      }
    },
    async mounted () {
      this.$q.loading.show()
      this.grid = await this.$store.dispatch('maps/get', this.$route.params.id)
      if (process.env.IS_STAGING) {
        const aclQuery = {role: 'public', id: this.grid.id, permission: 'get'}
        const permissions = await this.$store.dispatch('acl/isRoleAllowed', aclQuery)
        this.acl.public = permissions.get === true
      }
      this.$q.loading.hide()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState'
      }),
      availableRoles () {
        try {
          return this.user[`${process.env.AUTH0_APP_METADATA_PREFIX}roles`]
            .filter(role => role !== 'user')
            .map(role => { return { label: role, value: role } })
        }
        catch (e) {
          return []
        }
      },
      userHasPackager () {
        return userHasFeature(this.user, 'packager')
      }
    },
    methods: {
      async createPackage () {
        if (this.downloadURL) return openURL(this.downloadURL)
        this.$q.loading.show()
        try {
          const result = await this.$axios.post(
            `${process.env.PACKAGER_HOST}/packages`,
            {id: this.grid.id},
            {
              headers: {
                Authorization: `Bearer ${localStorage.access_token}`
              }
            }
          )
          this.downloadURL = result.data
          this.packageLabel = this.$t('buttons.download_package')
        }
        catch (err) {
          this.$handleError(this, err, 'errors.packaging_failed')
        }
        this.$q.loading.hide()
      },
      async updateACL () {
        this.$q.loading.show()
        await aclHelper.updateACL(this, this.acl, this.grid)
        this.$q.loading.hide()
      }
    }
  }
</script>
