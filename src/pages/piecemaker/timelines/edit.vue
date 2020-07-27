<template lang="pug">
  full-screen

    duplicate-timeline-modal(ref="duplicateModal", @confirm="duplicateTimeline")

    // --------------------------------------------------------------------------------------------------- edit timeline

    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.timelines.edit.title')")
      content-paragraph
        form-main(v-if="acl.put", v-model="payload", :schema="schema")
          //
          div(slot="form-buttons-add", :class="{'full-width row q-mb-sm': isMobile}")
            q-btn.col(v-if="$route.params.uuid", slot="form-buttons-add",
              :label="$t('buttons.duplicate_timeline')", @click="showDuplicateModal",
              color="grey", :class="[!isMobile ? 'q-mr-sm' : '']")
            q-btn.col(v-if="$route.params.uuid", slot="form-buttons-add",
              :label="exportLabel", @click="exportTimeline",
              color="grey", :class="[!isMobile ? 'q-mr-sm' : '']")
            q-btn(v-if="$route.params.uuid", @click="exportCSV", color="grey",
               :class="[!isMobile ? 'q-mr-sm' : '']", :label="exportLabelCSV")
        p(v-if="acl.put === false") {{ $t('errors.editing_forbidden') }}

    // -------------------------------------------------------------------------------------------------- access control
    content-block(v-if="acl.delete === true || acl.acl === true")
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
  import { Map } from 'mbjs-data-models'
  import { ObjectUtil } from 'mbjs-utils'
  import exportCSV from '../../../lib/export/csv'

  import { openURL } from 'quasar'
  import { mapGetters } from 'vuex'
  import PageSubNav from '../../../components/shared/navigation/PageSubNav'
  import DuplicateTimelineModal from '../../../components/piecemaker/modals/DuplicateTimelineModal'

  export default {
    components: {
      PageSubNav,
      BackButtonNew,
      FormMain,
      Headline,
      Tags,
      ContentBlock,
      ContentParagraph,
      Permissions,
      DuplicateTimelineModal
    },
    data () {
      const _this = this
      return {
        timeline: undefined,
        acl: {},
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
      try {
        this.timeline = await this.$store.dispatch('maps/get', this.$route.params.uuid)
        let acl
        acl = await this.$store.dispatch('acl/isAllowed', { id: this.timeline.id, permission: 'put' })
        this.acl = Object.assign({}, this.acl, acl)
        acl = await this.$store.dispatch('acl/isAllowed', { id: this.timeline.id, permission: 'delete' })
        this.acl = Object.assign({}, this.acl, acl)
      }
      catch (err) {
        this.$handleError(err)
      }
      this.$q.loading.hide()
    },
    computed: {
      ...mapGetters({
        user: 'auth/getUserState',
        isMobile: 'globalSettings/getIsMobile'
      })
    },
    methods: {
      showDuplicateModal () {
        this.$refs.duplicateModal.show(this.timeline.title + ' Copy')
      },
      async duplicateTimeline (title) {
        console.log('duplicate as', title, this.timeline)
        if (!title || !this.timeline) return
        this.$q.loading.show()
        try {
          const timeline = await this.$store.dispatch('maps/post', {
            title,
            type: this.timeline.type
          })
          if (timeline) {
            let result = await this.$store.dispatch('annotations/find', { 'target.id': this.timeline.id })
            const annotations = result.items
            for (let annotation of annotations) {
              annotation = annotation.toObject()
              let created, payload, title
              if (annotation.body) {
                if (annotation.body && annotation.body.type === 'Video') {
                  const { items } = (await this.$store.dispatch('annotations/find', { 'target.id': annotation.id }))
                  title = items.shift()
                  payload = {
                    body: annotation.body,
                    target: {
                      id: timeline.id,
                      type: annotation.target.type,
                      selector: annotation.target.selector
                    }
                  }
                }
                else {
                  payload = {
                    body: annotation.body,
                    target: {
                      id: timeline.id,
                      type: annotation.target.type,
                      selector: annotation.target.selector
                    }
                  }
                }
              }
              if (payload) {
                created = await this.$store.dispatch('annotations/post', payload)
              }
              if (title) {
                title = title.toObject()
                await this.$store.dispatch('annotations/post', {
                  body: title.body,
                  target: {
                    id: created.id,
                    type: title.target.type
                  }
                })
              }
            }
          }
        }
        catch (err) {
          this.$handleError(this, err, 'errors.duplicate_timeline_failed')
        }
        this.$q.loading.hide()
        this.$store.commit('notifications/addMessage', {
          body: 'messages.timeline_duplicated',
          mode: 'alert',
          type: 'success'
        })
        return this.$router.push({ name: 'piecemaker.timelines.list' })
      },
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
