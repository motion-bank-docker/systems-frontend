<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    h5.caption(dark).text-center {{ $t('routes.piecemaker.videos.create.title') }}
    .row
      .col-xs-12.offset-xs-none.col-xl-10.offset-xl-1
        .row.q-mt-md

          // calender-time-main

          // CALENDER
          //
          q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="event_note",
          :label="formatDate(modelCalender, 'MMM Do, YYYY')")
            // calender(@timeReset="reset", @calenderChange="calenderChange")
            calender(@timeReset="reset", @calenderChange="calenderChange")

          // TIME
          //
          q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="access_time",
          :label="formatDate(modelCalender, 'HH:mm:ss:SSS')")
            slider-time(:resettime="modelCalender", @slide="handlerSlide", @timeReset="reset")

        form-main(v-model="payload", :schema="schema")

</template>

<script>
  // import CalenderTimeMain from '../../../components/shared/forms/CalenderTimeMain'
  import Calender from '../../../components/shared/forms/Calender'
  import FormMain from '../../../components/shared/forms/FormMain'
  import FullScreen from '../../../components/shared/layouts/FullScreen'
  import SliderTime from '../../../components/shared/forms/SliderTime'

  import { date } from 'quasar'
  import { DateTime } from 'luxon'
  import { required } from 'vuelidate/lib/validators'
  import { guessType } from 'mbjs-media/src/util/metadata'
  import constants from 'mbjs-data-models/src'

  export default {
    components: {
      Calender,
      // CalenderTimeMain,
      FormMain,
      FullScreen,
      SliderTime
    },
    watch: {
      modelCalender: function (val) {
        if (val == null) this.modelCalender = Date.now()
      }
    },
    methods: {
      calenderChange (val) {
        this.modelCalender = date.adjustDate(this.modelCalender, {
          year: date.formatDate(val, 'YYYY'),
          month: date.formatDate(val, 'M') })
          // FIXME: days can't be adjusted. Bug in Quasar?
        /* this.modelCalender = date.adjustDate(this.modelCalender, {
          day: date.formatDate(val, 's') }) */
      },
      handlerSlide (val) {
        switch (val.target) {
        case 'hours':
          this.modelCalender = date.adjustDate(this.modelCalender, { hours: val.val })
          break
        case 'minutes':
          this.modelCalender = date.adjustDate(this.modelCalender, { minutes: val.val })
          break
        case 'seconds':
          this.modelCalender = date.adjustDate(this.modelCalender, { seconds: val.val })
          break
        case 'milliseconds':
          this.modelCalender = date.adjustDate(this.modelCalender, { milliseconds: val.val })
          break
        }
      },
      formatDate (val, format) {
        if (val) return date.formatDate(val, format)
      },
      reset (val) {
        let dateNow = Date.now()
        switch (val) {
        case 'date':
          this.modelCalender = date.adjustDate(this.modelCalender, {
            year: date.formatDate(dateNow, 'YYYY'),
            month: date.formatDate(dateNow, 'M') })
            // FIXME: days can't be adjusted. Bug in Quasar?
          /* this.modelCalender = date.adjustDate(this.modelCalender, {
            day: date.formatDate(dateNow, 'D') }) */
          break
        case 'time':
          this.modelCalender = date.adjustDate(this.modelCalender, {
            hours: date.formatDate(dateNow, 'H'),
            minutes: date.formatDate(dateNow, 'm'),
            seconds: date.formatDate(dateNow, 's'),
            milliseconds: date.formatDate(dateNow, 'SSS') })
          break
        }
        // console.log(date.formatDate(dateNow, 'D'))
      }
    },
    data () {
      const _this = this
      return {
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        modelCalender: Date.now(),
        payload: undefined,
        slider: {
          target: undefined,
          val: undefined
        },
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
                target: {
                  id: `${process.env.TIMELINE_BASE_URI}${_this.$route.params.groupId}`,
                  type: constants.MAP_TYPE_TIMELINE,
                  selector: {
                    type: 'Fragment',
                    value: DateTime.local().toString()
                  }
                }
              }
              return _this.$store.dispatch('annotations/post', _this.apiPayload)
                .then(() => _this.$router.push(`/piecemaker/timelines/${_this.$route.params.groupId}/videos`))
            }
          }
        }
      }
    }
  }
</script>

<style lang="stylus">
</style>
