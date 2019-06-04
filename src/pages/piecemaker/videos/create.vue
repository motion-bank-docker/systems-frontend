<template lang="pug">
  full-screen
    // q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    // back-button(slot="backButton")
    .q-px-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.videos.create.title') }}

      .row
        .col-md-12
          calendar-time-main(@update="onCalendarUpdate")
          form-main(v-model="payload", :schema="schema", ref="videoForm")
          q-btn(label="Cancel", @click.native="$router.push({name: 'piecemaker.timelines.show', params: {uuid: $route.params.timelineUuid} })")

</template>

<script>
  import CalendarTimeMain from '../../../components/shared/forms/CalendarTimeMain'
  import FormMain from '../../../components/shared/forms/FormMain'

  import { DateTime } from 'luxon'
  import { required } from 'vuelidate/lib/validators'
  import guessType from 'mbjs-media/src/util/guess-type'
  import titleHelper from 'mbjs-quasar/src/lib/title-helper'

  export default {
    components: {
      CalendarTimeMain,
      FormMain
    },
    methods: {
      onCalendarUpdate (val) {
        this.selectorTime = val
      }
    },
    data () {
      const _this = this
      return {
        timeline: undefined,
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        payload: { url: undefined, title: undefined },
        selectorTime: undefined,
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
            }
          },
          submit: {
            async handler () {
              const metadata = await _this.$store.dispatch('metadata/get', {
                body: {
                  source: {
                    id: _this.payload.url
                  }
                }
              })
              let
                start = _this.selectorTime || DateTime.local().toString(),
                end
              if (metadata && metadata.duration) {
                end = DateTime.fromISO(start, {setZone: true}).plus(metadata.duration * 1000).toISO()
              }
              const target = _this.timeline.getInterval(start, end)
              _this.apiPayload = {
                body: {
                  source: {
                    id: _this.payload.url,
                    type: guessType(_this.payload.url)
                  },
                  type: 'Video',
                  purpose: 'linking'
                },
                target
              }
              const annotation = await _this.$store.dispatch('annotations/post', _this.apiPayload)
              if (metadata) {
                await titleHelper.create(_this.$store, annotation.id, metadata.title)
              }
              _this.$router.push(`/piecemaker/videos/${annotation._uuid}/edit`)
            }
          }
        }
      }
    },
    async mounted () {
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.timelineUuid)
    }
  }
</script>

<style lang="stylus">
</style>
