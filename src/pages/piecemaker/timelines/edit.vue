<template lang="pug">
  full-screen

    // --------------------------------------------------------------------------------------------------- edit timeline

    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.timelines.edit.title')")
      content-paragraph
        form-main(v-model="payload", :schema="schema")
          //
          div(slot="form-buttons-add", :class="{'full-width row q-mb-sm': isMobile}")
            q-btn.col(v-if="$route.params.uuid", slot="form-buttons-add",
              :label="exportLabel", @click="exportTimeline",
              color="grey", :class="[!isMobile ? 'q-mr-sm' : '']")
            // q-btn(v-if="$route.params.uuid", @click="exportCSV", color="grey",
            //   :class="[!isMobile ? 'q-mr-sm' : '']", :label="exportLabelCSV")

    // -------------------------------------------------------------------------------------------------- access control
    content-block
      permissions(v-if="timeline", :resource="timeline.id")
</template>

<script>
  import Tags from '../../../components/shared/partials/Tags'
  import FormMain from '../../../components/shared/forms/FormMain'
  import BackButtonNew from '../../../components/shared/buttons/BackButtonNew'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'
  import Permissions from '../../../components/shared/partials/Permissions'

  import { required } from 'vuelidate/lib/validators'
  import constants from 'mbjs-data-models/src/constants'
  import { aclHelper } from 'mbjs-quasar/src/lib'
  import { Map } from 'mbjs-data-models'
  import { ObjectUtil } from 'mbjs-utils'
  import exportCSV from '../../../lib/export/csv'

  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'
  import PageSubNav from '../../../components/shared/navigation/PageSubNav'

  export default {
    components: {
      PageSubNav,
      BackButtonNew,
      FormMain,
      Headline,
      Tags,
      ContentBlock,
      ContentParagraph,
      Permissions
    },
    data () {
      const _this = this
      return {
        timeline: undefined,
        env: process.env,
        downloadURL: undefined,
        exportLabel: this.$t('buttons.export_timeline'),
        downloadUrlCSV: undefined,
        exportLabelCSV: this.$t('buttons.export_timeline_csv'),
        type: constants.mapClasses.MAP_CLASS_TIMELINE,
        payload: this.$route.params.uuid ? _this.$store.dispatch('maps/get', _this.$route.params.uuid) : undefined,
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
      })
    },
    methods: {
      async exportTimeline () {
        if (this.downloadURL) return openURL(this.downloadURL)
        this.$q.loading.show()
        try {
          const result = await this.$axios.post(
            `${this.$store.state.settings.apiHost}/archives/maps/${this.timeline._uuid}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${this.$auth.token}`
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
      async exportCSV () {
        if (this.downloadUrlCSV) return this.downloadUrlCSV.click()

        this.$q.loading.show()
        const { items } = await this.$store.dispatch('annotations/find', {
          'target.id': this.timeline.id
        })
        this.downloadUrlCSV = exportCSV(
          items.sort(this.$sort.onRef),
          `${ObjectUtil.slug(this.timeline.title)}-${this.timeline._uuid}.csv`
        )
        document.body.appendChild(this.downloadUrlCSV)
        this.exportLabelCSV = this.$t('buttons.download_csv')
        this.$q.loading.hide()
      }
    }
  }
</script>
