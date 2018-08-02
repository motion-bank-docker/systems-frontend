<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    h5.caption(dark).text-center {{ $t('routes.piecemaker.videos.create.title') }}
    .row
      .col-xs-12.offset-xs-none.col-xl-10.offset-xl-1
        .row.q-mt-md

          // CALENDER
          //
          q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="event_note", :label="formatDate(modelCalender, 'MMM Do, YYYY')")
            q-datetime-picker.shadow-6.full-width(v-model="modelCalender", dark)
            .text-center.q-mt-sm
              q-btn(@click="handlerReset()", label="Reset")

          // TIME SLIDERS
          //
          q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="access_time", :label="formatDate(modelCalender, 'HH:mm:ss:SSS')")
            slider-time(@slide="handlerSlide")
            .text-center.q-mt-sm
              q-btn(@click="handlerReset()", label="Reset")

        form-main(v-model="payload", :schema="schema")

</template>

<script>
  import FormMain from '../../../components/shared/forms/FormMain'
  import SliderTime from '../../../components/shared/forms/SliderTime'
  import FullScreen from '../../../components/shared/layouts/FullScreen'

  import { date } from 'quasar'
  import { DateTime } from 'luxon'
  import { required } from 'vuelidate/lib/validators'
  import { guessType } from '../../../lib/annotations/videos'
  import constants from '../../../lib/constants'

  export default {
    components: {
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
      handlerReset () {
        this.modelCalender = Date.now()
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
