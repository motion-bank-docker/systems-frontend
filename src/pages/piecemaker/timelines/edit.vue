<template lang="pug">
  full-screen

    // --------------------------------------------------------------------------------------------------- edit timeline

    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.timelines.edit.title')")
      content-paragraph
        form-main(v-model="payload", :schema="schema")
          div(slot="form-buttons-add", :class="{'full-width row q-mb-sm': isMobile}")
            q-btn.col(v-if="$route.params.uuid", slot="form-buttons-add", :label="exportLabel", @click="exportTimeline",
            color="grey", :class="[!isMobile ? 'q-mr-sm' : '']")

    // -------------------------------------------------------------------------------------------------- access control

    content-block(v-if="availableRoles.length", :position="'last'")
      headline.q-mt-lg(:content="$t('labels.access_control')")
        | {{ $t('descriptions.access_control') }}

      // 'add to group'
      content-paragraph
        q-select(v-model="acl.group", :clearable="true", :clear-value="undefined",
        :float-label="$t('labels.access_control_add_group')", :options="availableRoles", dark)

      // 'remove from group'
      content-paragraph
        q-select(v-model="acl.group_remove", :clearable="true", :clear-value="undefined",
        :float-label="$t('labels.access_control_remove_group')", :options="availableRoles", dark)

      // 'apply to all contained annotations and videos'
      content-paragraph
        q-checkbox(v-model="acl.recursive", :label="$t('labels.recursive')", dark)

      // update button
      content-paragraph
        q-btn(:label="$t('buttons.update_access_control')", @click="updateACL", color="primary",
        slot="buttons", :class="{'full-width': isMobile}")
</template>

<script>
  import AccessControl from '../../../components/shared/forms/AccessControl'
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'
  import BackButtonNew from '../../../components/shared/buttons/BackButtonNew'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'
  import { aclHelper } from 'mbjs-quasar/src/lib'
  import { Map } from 'mbjs-data-models'

  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'
  import PageSubNav from '../../../components/shared/navigation/PageSubNav'

  export default {
    components: {
      PageSubNav,
      AccessControl,
      BackButtonNew,
      FormMain,
      Headline,
      Tags,
      ContentBlock,
      ContentParagraph
    },
    data () {
      const _this = this
      return {
        timeline: undefined,
        env: process.env,
        downloadURL: undefined,
        exportLabel: this.$t('buttons.export_timeline'),
        type: constants.mapTypes.MAP_TYPE_TIMELINE,
        payload: this.$route.params.uuid ? _this.$store.dispatch('maps/get', _this.$route.params.uuid) : undefined,
        acl: {
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
              const instance = new Map(_this.payload)
              return _this.$store.dispatch('maps/patch', [instance._uuid, _this.payload])
                .then(() => _this.$router.push({ name: 'piecemaker.timelines.list' }))
            }
          }
        }
      }
    },
    async mounted () {
      this.$root.$emit('setBackButton', '/piecemaker/timelines')
      this.$q.loading.show()
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.uuid)
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
      }
    },
    methods: {
      async exportTimeline () {
        if (this.downloadURL) return openURL(this.downloadURL)
        this.$q.loading.show()
        try {
          const result = await this.$axios.post(
            `${process.env.API_HOST}/archives/maps`,
            {uuid: this.timeline._uuid},
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
      async updateACL () {
        this.$q.loading.show()
        await aclHelper.updateACL(this, this.acl, this.timeline)
        this.$q.loading.hide()
      }
    }
  }
</script>
