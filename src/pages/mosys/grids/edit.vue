<template lang="pug">
  full-screen

    // ------------------------------------------------------------------------------------------------------- edit grid

    content-block(:position="'first'")
      headline(:content="$t('routes.mosys.grids.edit.title')")
        // | {{ payload.title }}

      content-paragraph
        form-main(v-if="acl.put", v-model="payload", :schema="schema")
          //
          div(slot="form-buttons-add", :class="{'full-width row q-mb-sm': isMobile}")
            q-btn.bg-grey-9.col.q-mr-md(q-if="$route.params.uuid", :label="exportLabel",
            @click="exportGrid", :class="[!isMobile ? '' : '']")
            // q-btn.bg-grey-9.col(q-if="$route.params.uuid && userHasPackager", :label="packageLabel",
            // @click="createPackage",
            // :class="[!isMobile ? 'q-mx-sm' : 'q-ml-sm']")
        p(v-if="acl.put === false") {{ $t('errors.editing_forbidden') }}

    // -------------------------------------------------------------------------------------------------- access control
    content-block(v-if="acl.delete === true || acl.acl === true")
      permissions(v-if="grid", :resource="grid.id")

    // -------------------------------------------------------------------------------------------------- css stylesheet

    //
      content-block(v-if="userHasCSSEditing", :position="'last'")
        headline(:content="$t('labels.css_stylesheet')")
          | {{ $t('descriptions.css_stylesheet') }}

        // external css stylesheet url
        content-paragraph(:position="'first'")
          q-input(v-model="stylesheetUrl", dark, type="text", float-label="External CSS Stylesheet URL")

        // embedded css stylesheet
        content-paragraph
          q-input(v-model="stylesheet", dark, type="textarea", float-label="Embedded CSS Stylesheet", rows="4")

        // button "submit"
        content-paragraph(:position="'last'")
          q-btn(q-if="$route.params.uuid", color="primary", label="Submit", @click="submit",
          // :class="[isMobile ? 'full-width' : '']", slot="buttons")

</template>

<script>
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'
  import Permissions from '../../../components/shared/partials/Permissions'

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'
  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'
  import { userHasFeature, aclHelper } from 'mbjs-quasar/src/lib'

  export default {
    components: {
      FormMain,
      Tags,
      Headline,
      ContentBlock,
      ContentParagraph,
      Permissions
    },
    data () {
      const _this = this
      return {
        acl: {},
        grid: undefined,
        stylesheet: undefined,
        stylesheetUrl: undefined,
        env: process.env,
        exportDownloadURL: undefined,
        exportLabel: this.$t('buttons.export_grid'),
        packageLabel: this.$t('buttons.create_package'),
        packageDownloadURL: undefined,
        type: constants.mapClasses.MAP_CLASS_GRID,
        payload: this.$route.params.uuid ? _this.$store.dispatch('maps/get', _this.$route.params.uuid) : undefined,
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
              return _this.submit(false).then(() => _this.$router.push({ name: 'mosys.grids.list' }))
            }
          }
        }
      }
    },
    async mounted () {
      this.$q.loading.show()
      try {
        this.grid = await this.$store.dispatch('maps/get', this.$route.params.uuid)
        let acl
        acl = await this.$store.dispatch('acl/isAllowed', {id: this.grid.id, permission: 'put'})
        this.acl = Object.assign({}, this.acl, acl)
        acl = await this.$store.dispatch('acl/isAllowed', {id: this.grid.id, permission: 'delete'})
        this.acl = Object.assign({}, this.acl, acl)
      }
      catch (err) {
        this.$handleError(err)
      }

      if (this.userHasCSSEditing) {
        this.stylesheet = this.grid.stylesheet ? this.grid.stylesheet.value : undefined
        this.stylesheetUrl = this.grid.stylesheet ? this.grid.stylesheet.id : undefined
      }
      this.$q.loading.hide()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        isMobile: 'globalSettings/getIsMobile'
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
      },
      userHasCSSEditing () {
        return userHasFeature(this.user, 'cssediting')
      }
    },
    methods: {
      async submit (message = true) {
        let stylesheet
        if (this.userHasCSSEditing) {
          stylesheet = {
            stylesheet: {
              id: this.stylesheetUrl && this.stylesheetUrl.length ? this.stylesheetUrl : null,
              value: this.stylesheet && this.stylesheet.length ? this.stylesheet : null
            }
          }
        }
        const apiPayload = Object.assign({}, this.payload, stylesheet)
        let result
        result = await this.$store.dispatch('maps/patch', [this.payload.id, apiPayload])
        if (message) {
          this.$store.commit('notifications/addMessage', {
            type: 'success',
            body: 'messages.submit_success'
          })
        }
        return result
      },
      async exportGrid () {
        if (this.exportDownloadURL) return openURL(this.exportDownloadURL)
        this.$q.loading.show()
        try {
          const result = await this.$axios.post(
            `${this.$store.state.settings.apiHost}/archives/maps/${this.grid._uuid}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${this.$auth.token}`
              }
            }
          )
          this.exportDownloadURL = result.data
          this.exportLabel = this.$t('buttons.download_archive')
        }
        catch (err) {
          this.$handleError(this, err, 'errors.export_archive_failed')
        }
        this.$q.loading.hide()
      },
      async createPackage () {
        if (this.packageDownloadURL) return openURL(this.packageDownloadURL)
        this.$q.loading.show()
        try {
          const result = await this.$axios.post(
            `${process.env.PACKAGER_HOST}/packages`,
            {uuid: this.grid._uuid},
            {
              headers: {
                Authorization: `Bearer ${this.$auth.token}`
              }
            }
          )
          this.packageDownloadURL = result.data
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
