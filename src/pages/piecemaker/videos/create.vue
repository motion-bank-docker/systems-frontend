<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    // .q-pa-xl(style="min-width: 50vw;")
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

          // TIME
          //
          q-collapsible.col-xs-12.col-lg-6.q-mb-lg(group="somegroup", icon="access_time", :label="formatDate(modelCalender, 'HH:mm:ss:SSS')")
            q-list.no-border.q-px-lg.shadow-6

              //
                // HOURS
                q-item.no-padding
                  q-item-side
                    q-btn(@click="sliderHours--", round, size="sm", icon="remove", color="grey-9")
                  q-item-main
                    q-slider(v-model="sliderHours", :min="0", :max="23", label-always, :label-value="`${sliderHours}h`")
                  q-item-side
                    q-btn(@click="sliderHours++", round, size="sm", icon="add", dark, color="grey-9")

                // MINUTES
                q-item.no-padding
                  q-item-side
                    q-btn(@click="sliderMinutes--", round, size="sm", icon="remove", color="grey-9")
                  q-item-main
                    q-slider(v-model="sliderMinutes", :min="0", :max="59", label-always, :label-value="`${sliderMinutes}min`")
                  q-item-side
                    q-btn(@click="sliderMinutes++", round, size="sm", icon="add", dark, color="grey-9")

                // SECONDS
                q-item.no-padding
                  q-item-side
                    q-btn(@click="sliderSeconds--", round, size="sm", icon="remove", color="grey-9")
                  q-item-main
                    q-slider(v-model="sliderSeconds", :min="0", :max="59", label-always, :label-value="`${sliderSeconds}s`")
                  q-item-side
                    q-btn(@click="sliderSeconds++", round, size="sm", icon="add", dark, color="grey-9")

                // MILLISECONDS
                q-item.no-padding
                  q-item-side
                    q-btn(@click="sliderMilliseconds--", round, size="sm", icon="remove", color="grey-9")
                  q-item-main
                    q-slider(v-model="sliderMilliseconds", :min="0", :max="999", label-always, :label-value="`${sliderMilliseconds}ms`")
                  q-item-side
                    q-btn(@click="sliderMilliseconds++", round, size="sm", icon="add", dark, color="grey-9")

              // TEST
              slider-time

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
      },
      sliderHours: function (val) {
        this.modelCalender = date.adjustDate(this.modelCalender, { hours: val })
      },
      sliderMinutes: function (val) {
        this.modelCalender = date.adjustDate(this.modelCalender, { minutes: val })
      },
      sliderSeconds: function (val) {
        this.modelCalender = date.adjustDate(this.modelCalender, { seconds: val })
      },
      sliderMilliseconds: function (val) {
        this.modelCalender = date.adjustDate(this.modelCalender, { milliseconds: val })
      }
    },
    methods: {
      /* handlerCalender () {
        this.showCalender = !this.showCalender
      }, */
      formatDate (val, format) {
        if (val) return date.formatDate(val, format)
      },
      handlerReset () {
        // this.modelCalender = date.adjustDate(this.modelCalender, { hours: date.formatDate(Date.now(), 'HH'), minutes: date.formatDate(Date.now(), 'mm'), seconds: date.formatDate(Date.now(), 'ss'), milliseconds: date.formatDate(Date.now(), 'SSS') })
        this.modelCalender = Date.now()
        this.sliderHours = this.formatDate(this.modelCalender, 'H')
        this.sliderMinutes = this.formatDate(this.modelCalender, 'm')
        this.sliderSeconds = this.formatDate(this.modelCalender, 'S')
        this.sliderMilliseconds = this.formatDate(this.modelCalender, 'SSS')
      }
    },
    mounted () {
      this.sliderHours = this.formatDate(this.modelCalender, 'H')
      this.sliderMinutes = this.formatDate(this.modelCalender, 'm')
      this.sliderSeconds = this.formatDate(this.modelCalender, 'S')
      this.sliderMilliseconds = this.formatDate(this.modelCalender, 'SSS')
    },
    data () {
      const _this = this
      return {
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        // currentDate: DateTime.local().toLocaleString({ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' }),
        currentDate: DateTime.local().toLocaleString({ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' }),
        modelCalender: Date.now(),
        // showCalender: false,
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
        },
        schemaSlider: [
          {
            target: 'sliderMinutes'
          }
        ],
        sliderHours: null,
        sliderMilliseconds: null,
        sliderMinutes: null,
        sliderSeconds: null
      }
    }
  }
</script>

<style lang="stylus">
  .moba-border-bottom
    border-bottom 1px solid white
  .moba-hover
    vertical-align middle
  .moba-hover:hover
    background-color rgba(255, 255, 255, .025)
</style>
