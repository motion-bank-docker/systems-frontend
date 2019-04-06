<template lang="pug">
  full-screen
    // q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    back-button(slot="backButton")
    .q-px-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.videos.edit.title') }}

      .row
        .col-md-12
          calendar-time-main(:datetime="selectorValue", @update="onCalendarUpdate")
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

  import { parseURI } from 'mbjs-data-models/src/lib'

  export default {
    components: {
      AccessControl,
      CalendarTimeMain,
      FormMain
    },
    methods: {
      onCalendarUpdate (val) {
        this.selectorOverride = val
      },
      async createTitle (id, value) {
        const titlePayload = {
          body: {
            value,
            type: 'TextualBody',
            purpose: 'describing'
          },
          target: {
            type: 'Annotation',
            id
          }
        }
        const title = await this.$store.dispatch('annotations/post', titlePayload)
        return title
      },
      async updateTitle (uuid, value) {
        const titlePayload = { body: { value } }
        const title = await this.$store.dispatch('annotations/patch', [uuid, titlePayload])
        return title
      },
      async removeTitle (uuid) {
        await this.$store.dispatch('annotations/delete', uuid)
      }
    },
    computed: {
      url () {
        if (this.payload) return this.payload.url
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
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        selectorOverride: undefined,
        selectorValue: undefined,
        titlePayload: undefined,
        meta: undefined,
        map: undefined,
        payload: context.$store.dispatch('annotations/get', context.$route.params.id)
          .then(async result => {
            this.map = await this.$store.dispatch('maps/get', parseURI(result.target.id).uuid)
            this.meta = await this.$store.dispatch('metadata/get', result)
            this.titlePayload = this.meta.titleAnnotation
            this.selectorValue = result.target.selector.value

            const tags = await context.$store.dispatch('tags/get', result)

            return {
              gid: result.target.id,
              uuid: result.uuid,
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
                await context.createTitle(context.payload.id, context.payload.title)
              }
              else if (context.titlePayload && context.payload.title === context.meta.originalTitle) {
                await context.removeTitle(context.titlePayload.uuid)
              }
              else if (context.titlePayload && context.payload.title !== context.titlePayload.body.value) {
                await context.updateTitle(context.titlePayload.uuid, context.payload.title)
              }
              context.apiPayload = {
                target: {
                  id: context.payload.timeline,
                  selector: {
                    value: context.selectorOverride || context.selectorValue
                  }
                },
                body: {
                  source: {
                    id: context.payload.url,
                    type: guessType(context.payload.url)
                  }
                }
              }
              await context.$store.dispatch('annotations/patch', [context.payload.uuid, context.apiPayload])
              await context.$store.dispatch('tags/set', [context.payload, context.payload.tags])

              context.$router.push({
                name: 'piecemaker.videos.list',
                params: { timelineId: parseURI(context.payload.gid).uuid }
              })
            }
          }
        }
      }
    }
  }
</script>
