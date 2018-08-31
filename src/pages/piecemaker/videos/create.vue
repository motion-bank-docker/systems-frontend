<template lang="pug">
  full-screen
    back-button(slot="backButton")
    h5.caption(dark).text-center {{ $t('routes.piecemaker.videos.create.title') }}
    .row
      .col-xs-12.offset-xs-none.col-xl-10.offset-xl-1
        .row.q-mt-md
          calendar-time-main(v-if="staging", @getTimeAndDate="getTimeAndDate")

        form-main(v-model="payload", :schema="schema")

</template>

<script>
  import CalendarTimeMain from '../../../components/shared/forms/CalendarTimeMain'
  import FormMain from '../../../components/shared/forms/FormMain'

  import { DateTime } from 'luxon'
  import { required } from 'vuelidate/lib/validators'
  import guessType from 'mbjs-media/src/util/guess-type'

  export default {
    components: {
      CalendarTimeMain,
      FormMain
    },
    methods: {
      getTimeAndDate (val) {
        console.log(val)
      }
    },
    data () {
      const _this = this
      return {
        timeline: undefined,
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        payload: undefined,
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
            handler () {
              _this.apiPayload = {
                body: {
                  source: {
                    id: _this.payload.url,
                    type: guessType(_this.payload.url)
                  },
                  type: 'Video',
                  purpose: 'linking'
                },
                target: this.timeline.getTimelineTarget(DateTime.local().toString())
              }
              return _this.$store.dispatch('annotations/post', _this.apiPayload)
                .then(() => _this.$router.push(`/piecemaker/timelines/${_this.$route.params.timelineId}/videos`))
            }
          }
        },
        staging: process.env.IS_STAGING
      }
    },
    async mounted () {
      this.timeline = await this.$store.dispatch('maps/get', this.$route.params.timelineId)
    }
  }
</script>

<style lang="stylus">
</style>
