<template lang="pug">
  full-screen

    content-block(:position="'first'")
      headline(:content="$t('routes.piecemaker.media.edit.title') + ':'")
        | {{ payload.title }} ({{ duration }})

      content-paragraph(:position="'first'")
        calendar-time-main(:datetime="selectorValue", @update="onCalendarUpdate")

      content-paragraph
        // p.q-mt-md {{ $t('labels.media_duration') }}: {{ duration }}
        p(v-if="selectorOverride !== selectorValue") {{ $t('messages.caution_media_time_override') }}

      content-paragraph
        form-main(v-model.lazy="payload", :schema="schema", ref="mediaForm")
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
        this.timeline = await this.$store.dispatch('maps/get', parseURI(this.media.target.id).uuid)
        this.$root.$emit('setBackButton', '/piecemaker/timelines/' + parseURI(this.media.target.id).uuid + '/media')
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
          return Array.isArray(parsed['date-time:t']) ? parsed['date-time:t'][0].toISO() : parsed['date-time:t'].toISO()
        }
      },
      duration () {
        if (this.annotation && this.annotation.target.selector) {
          console.log(this.annotation.target.selector)
          return this.annotation.target.selector.getDuration().toFormat(constants.config.TIMECODE_FORMAT_DURATION)
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
      await this.getMedia()
      this.$q.loading.hide()
    },
    data () {
      const context = this
      return {
        apiPayload: undefined,
        selectorOverride: undefined,
        titlePayload: undefined,
        media: undefined,
        meta: undefined,
        map: undefined,
        annotation: undefined,
        payload: this.$store.dispatch('annotations/get', this.$route.params.uuid)
          .then(async result => {
            context.$q.loading.show()

            this.annotation = result
            this.map = await this.$store.dispatch('maps/get', parseURI(result.target.id).uuid)
            this.meta = await this.$store.dispatch('metadata/getLocal', result)
            this.titlePayload = this.meta.titleAnnotation

            const tags = await this.$store.dispatch('tags/get', result)

            context.$q.loading.hide()

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
