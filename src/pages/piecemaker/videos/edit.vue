<template lang="pug">
  full-screen
    // q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    back-button(slot="backButton")
    .q-px-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.videos.edit.title') }}

      .row
        .col-md-12
          calendar-time-main(:datetime="selectorValue", @update="onCalendarUpdate")
          p {{ $t('labels.video_duration') }}: {{ duration }}
          p.q-mb-lg(v-if="selectorOverride !== selectorValue") {{ $t('messages.caution_video_time_override') }}
          form-main(v-model.lazy="payload", :schema="schema", ref="videoForm")

      .row
        .col-md-12
          access-control
</template>

<script>
  import AccessControl from '../../../components/shared/forms/AccessControl'
  import CalendarTimeMain from '../../../components/shared/forms/CalendarTimeMain'
  import FormMain from '../../../components/shared/forms/FormMain'

  import { required } from 'vuelidate/lib/validators'
  import guessType from 'mbjs-media/src/util/guess-type'
  import titleHelper from 'mbjs-quasar/src/lib/title-helper'

  import constants from 'mbjs-data-models/src/constants'
  import { parseURI } from 'mbjs-data-models/src/lib'
  import { DateTime } from 'luxon'

  export default {
    components: {
      AccessControl,
      CalendarTimeMain,
      FormMain
    },
    methods: {
      onCalendarUpdate (val) {
        this.selectorOverride = val
      }
    },
    computed: {
      url () {
        if (this.payload) return this.payload.url
      },
      selectorValue () {
        if (this.annotation) {
          const parsed = this.annotation.target.selector.parse()
          return Array.isArray(parsed['date-time:t']) ? parsed['date-time:t'][0].toISO() : parsed['date-time:t'].toISO()
        }
      },
      duration () {
        if (this.annotation && this.annotation.target.selector) {
          return this.annotation.target.selector.getDuration().toFormat(constants.config.TIMECODE_FORMAT)
        }
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
      this.$q.loading.hide()
    },
    data () {
      const context = this
      return {
        apiPayload: undefined,
        selectorOverride: undefined,
        titlePayload: undefined,
        meta: undefined,
        map: undefined,
        annotation: undefined,
        payload: this.$store.dispatch('annotations/get', this.$route.params.uuid)
          .then(async result => {
            this.annotation = result
            this.map = await this.$store.dispatch('maps/get', parseURI(result.target.id).uuid)
            this.meta = await this.$store.dispatch('metadata/get', result)
            this.titlePayload = this.meta.titleAnnotation

            const tags = await this.$store.dispatch('tags/get', result)

            return {
              gid: result.target.id,
              _uuid: parseURI(result.target.id).uuid,
              url: result.body.source.id,
              id: result.id,
              title: this.meta.title,
              timeline: result.target.id,
              tags
            }
          }),
        schema: {
          fields: {
            url: {
              fullWidth: true,
              type: 'text',
              label: 'labels.video_url',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            },
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.video_title'
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
              if (context.selectorOverride) {
                const
                  durationMs = context.annotation.target.selector._valueDuration,
                  end = durationMs ? DateTime.fromISO(context.selectorOverride, {setZone: true})
                    .plus(durationMs).toISO() : undefined
                const target = context.map.getInterval(context.selectorOverride, end)
                selector = target.selector.toObject()
              }
              else selector = context.annotation.target.selector.toObject()
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
                name: 'piecemaker.videos.list',
                params: { timelineUuid: parseURI(context.payload.gid).uuid }
              })
            }
          }
        }
      }
    }
  }
</script>
