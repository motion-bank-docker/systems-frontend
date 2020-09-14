<template lang="pug">
  full-screen

    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.media.edit.title') + ':'")
        | {{ payload.title }} ({{ duration }})

      .q-mb-lg
        q-alert(color="info" :actions="actions" v-if="showDurationOverride") {{ $t('routes.piecemaker.media.edit.duration_found') }}

      content-paragraph(v-if="selectorValue && acl.put", :position="'first'")
        calendar-time-main(:datetime="selectorValue", @update="onCalendarUpdate")

      content-paragraph(v-if="selectorValue && acl.put")
        // p.q-mt-md {{ $t('labels.media_duration') }}: {{ duration }}
        p(v-if="selectorOverride !== selectorValue") {{ $t('messages.caution_media_time_override') }}

      content-paragraph
        form-main(v-if="acl.put", v-model.lazy="payload", :schema="schema", ref="mediaForm")
          div(slot="form-buttons-add", :class="{'full-width row q-mb-sm': isMobile}")
            q-btn(v-if="$route.params.uuid", @click="exportEAF", color="grey", :disabled="!canExportEAF"
              :class="[!isMobile ? 'q-mr-sm' : '']", :label="exportLabelEAF")
        p(v-if="acl.put === false") {{ $t('errors.editing_forbidden') }}
</template>

<script>
  import { mapGetters } from 'vuex'

  import CalendarTimeMain from '../../../components/shared/forms/CalendarTimeMain'
  import FormMain from '../../../components/shared/forms/FormMain'
  import Headline from '../../../components/shared/elements/Headline'
  import ContentBlock from '../../../components/shared/elements/ContentBlock'
  import ContentParagraph from '../../../components/shared/elements/ContentParagraph'

  import { required } from 'vuelidate/lib/validators'
  import guessType from 'mbjs-media/src/util/guess-type'
  import titleHelper from 'mbjs-quasar/src/lib/title-helper'

  import constants from 'mbjs-data-models/src/constants'
  import { parseURI } from 'mbjs-data-models/src/lib'
  import { ObjectUtil } from 'mbjs-utils'
  import { DateTime } from 'luxon'

  export default {
    components: {
      CalendarTimeMain,
      FormMain,
      Headline,
      ContentBlock,
      ContentParagraph
    },
    methods: {
      onCalendarUpdate (val) {
        this.selectorOverride = val
      },
      async getMedia () {
        this.media = await this.$store.dispatch('annotations/get', this.$route.params.uuid)
        let acl
        acl = await this.$store.dispatch('acl/isAllowed', { id: this.media.id, permission: 'put' })
        this.acl = Object.assign({}, this.acl, acl)
        this.timeline = await this.$store.dispatch('maps/get', parseURI(this.media.target.id).uuid)
        this.$root.$emit('setBackButton', '/piecemaker/timelines/' + parseURI(this.media.target.id).uuid + '/media')
      },
      async exportEAF () {
        if (this.downloadUrlEAF) return this.downloadUrlEAF.click()

        this.$q.loading.show()
        const query = {
          'target.id': this.timeline.id,
          'target.type': constants.mapTypes.MAP_TYPE_TIMELINE,
          'target.selector._valueMillis': { $gte: this.media.target.selector._valueMillis },
          'body.type': { $in: ['TextualBody', 'VocabularyEntry'] }
        }
        if (this.media.target.selector._valueDuration) {
          query['target.selector._valueMillis']['$lte'] = this.media.target.selector._valueMillis +
            this.media.target.selector._valueDuration
        }
        const results = await this.$store.dispatch('annotations/find', query)
        const metadata = await this.$store.dispatch('metadata/getLocal', this.media)
        const doc = await this.$store.dispatch('elan/generateEAF', {
          annotations: results.items,
          map: this.timeline,
          media: this.media,
          metadata
        })
        const eafData = `data:text/x-eaf+xml;charset=utf-8,${doc}`
        const download = document.createElement('a')
        download.setAttribute('href', encodeURI(eafData))
        download.setAttribute('download', `media_${ObjectUtil.slug(metadata.title)}-${this.timeline._uuid}.eaf`)
        this.downloadUrlEAF = download
        this.exportLabelEAF = this.$t('buttons.download_eaf')
        this.$q.loading.hide()
      }
    },
    computed: {
      ...mapGetters({
        isMobile: 'globalSettings/getIsMobile'
      }),
      url () {
        if (this.payload) return this.payload.url
      },
      selectorValue () {
        if (this.annotation) {
          const parsed = this.annotation.target.selector.parse()
          const value = Array.isArray(parsed['date-time:t'])
            ? parsed['date-time:t'].shift() : parsed['date-time:t']
          if (value && typeof value.toISO === 'function') return value.toISO()
          return value
        }
      },
      duration () {
        if (this.annotation && this.annotation.target.selector) {
          const duration = this.annotation.target.selector.getDuration()
          if (duration) return duration.toFormat(constants.config.TIMECODE_FORMAT_DURATION)
        }
      },
      canExportEAF () {
        return this.annotation && ['video/mp4', 'audio/m4a'].indexOf(this.annotation.body.source.type) > -1
      }
    },
    watch: {
      async url (val) {
        if (typeof val === 'string' && val !== this.payload.url) {
          const meta = await this.$store.dispatch('metadata/get', { body: { source: { id: val } } })
          this.payload.title = meta.title
        }
      }
    },
    async mounted () {
      this.$q.loading.show()
      try {

      }
      catch (err) {
        this.$handleError(err)
      }
      this.schema.fields.tags.autocompleteOptions = await this.$store.dispatch('tags/list')
      const timelinesResult = await this.$store.dispatch('maps/find', {
        type: 'Timeline'
      })
      this.schema.fields.timeline.options = timelinesResult.items.map(item => {
        return {
          value: item.id,
          label: item.title
        }
      }).sort((a, b) => (a.label || '').localeCompare(b.label || ''))
      await this.getMedia()
      this.$q.loading.hide()
    },
    data () {
      const context = this
      return {
        actions: [
          {
            label: this.$t('buttons.add_duration'),
            handler () {
              context.payload.duration = context.meta.duration
            }
          }
        ],
        acl: {},
        apiPayload: undefined,
        downloadUrlEAF: undefined,
        exportLabelEAF: this.$t('buttons.export_media_eaf'),
        selectorOverride: undefined,
        showDurationOverride: false,
        titlePayload: undefined,
        media: undefined,
        meta: undefined,
        map: undefined,
        annotation: undefined,
        payload: this.$store.dispatch('annotations/get', this.$route.params.uuid)
          .then(async result => {
            context.$q.loading.show()

            let duration
            if (result.target.selector) {
              duration = result.target.selector.getDuration()
            }

            if (!duration) {
              this.meta = await this.$store.dispatch('metadata/get', result)
              this.showDurationOverride = !!this.meta.duration
            }
            else {
              duration = (duration.as('milliseconds') * 0.001).toFixed(3)
              this.meta = await this.$store.dispatch('metadata/getLocal', result)
            }

            this.annotation = result
            this.map = await this.$store.dispatch('maps/get', parseURI(result.target.id).uuid)
            this.titlePayload = this.meta.titleAnnotation

            const tags = await this.$store.dispatch('tags/get', result)

            context.$q.loading.hide()

            return {
              gid: result.target.id,
              _uuid: parseURI(result.target.id).uuid,
              url: result.body.source.id,
              id: result.id,
              duration,
              title: this.meta.title,
              timeline: result.target.id,
              tags
            }
          }),
        schema: {
          fields: {
            duration: {
              fullWidth: true,
              type: 'text',
              label: 'labels.duration_seconds'
            },
            url: {
              fullWidth: true,
              type: 'text',
              label: 'labels.media_url',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            },
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.media_title'
            },
            tags: {
              fullWidth: true,
              type: 'chips',
              label: 'labels.tags',
              autocompleteOptions: []
            },
            timeline: {
              fullWidth: true,
              type: 'select',
              label: 'labels.associated_timeline',
              helperLabel: 'labels.associated_timeline_warning',
              options: []
            }
          },
          submit: {
            async handler () {
              if (!context.titlePayload && context.payload.title !== context.meta.title) {
                await titleHelper.create(context.$store, context.payload.id, context.payload.title)
              }
              // else if (context.titlePayload && context.payload.title === context.meta.originalTitle) {
              //   await titleHelper.remove(context.$store, context.titlePayload.id)
              // }
              else if (context.titlePayload && context.payload.title !== context.titlePayload.body.value) {
                await titleHelper.update(context.$store, context.titlePayload.id, context.payload.title)
              }
              let selector
              if (context.payload.duration) {
                const duration = Math.round(parseFloat(context.payload.duration) * 1000)
                const target = context.map.getInterval(
                  DateTime.fromMillis(context.annotation.target.selector._valueMillis).toISO(),
                  DateTime.fromMillis(context.annotation.target.selector._valueMillis)
                    .plus(duration).toISO())
                selector = target.selector.toObject()
              }
              if (context.selectorOverride) {
                const
                  durationMs = (selector || context.annotation.target.selector)._valueDuration,
                  end = durationMs ? DateTime.fromISO(context.selectorOverride, {setZone: true})
                    .plus(durationMs).toISO() : undefined
                const target = context.map.getInterval(context.selectorOverride, end)
                selector = target.selector.toObject()
              }
              else selector = (selector || context.annotation.target.selector).toObject()
              context.apiPayload = {
                target: {
                  id: context.payload.timeline,
                  selector
                },
                body: {
                  source: {
                    id: context.payload.url,
                    type: guessType(context.payload.url)
                  }
                }
              }
              await context.$store.dispatch('annotations/patch', [context.annotation._uuid, context.apiPayload])
              await context.$store.dispatch('tags/set', [context.payload, context.payload.tags])

              context.$router.push({
                name: 'piecemaker.media.list',
                params: { timelineUuid: parseURI(context.payload.gid).uuid }
              })
            }
          }
        }
      }
    }
  }
</script>
