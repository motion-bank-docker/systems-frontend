<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    // .q-pa-xl(style="min-width: 50vw;")
    h5.caption(dark).text-center {{ $t('routes.piecemaker.videos.create.title') }}
    .row
      .col-xs-12.offset-xs-none.col-sm-10.offset-sm-1.col-md-8.offset-md-2

        // BUTTONS
        //
        .row.cursor-pointer
          .row.col-10.moba-hover(@click="handlerCalender()")
            .col-1
              q-btn(icon="keyboard_arrow_up", :class="{'rotate-180' : showCalender}", round, flat)
            .col-11
              span
                q-icon.q-mr-sm(name="event_note", no-caps)
                | {{ formatDate(modelCalender, 'MMM Do, YYYY') }}
              span.q-mx-lg
                q-icon.q-mr-xs(name="access_time", no-caps)
                | {{ formatDate(modelCalender, 'HH:mm:ss:SSS') }}h
              //
                span
                  q-btn(@click="modelCalender = null", icon="clear", round, size="sm")
              //
                q-btn(icon="event_note", no-caps)
                  .q-ml-md {{ formatDate(modelCalender, 'MMM Do, YYYY') }}
                q-btn.q-mx-sm(icon="access_time", no-caps)
                  .q-ml-md {{ formatDate(modelCalender, 'HH:mm:ss:SSS') }}h
          .col-2.text-right
            q-btn(@click="modelCalender = null", icon="clear", round, flat)

        .row.q-mt-md(v-if="showCalender")

          // CALENDER
          //
          q-datetime-picker.col-6.shadow-6(v-if="calender = 'val'", v-model="modelCalender", dark)
          // q-datetime.q-mb-xs(v-model="modelCalender", :before="[{icon: 'event_note'}]", type="date", format24h, dark, clearable, modal, :placeholder="currentDate", float-label="Set date")
          // q-datetime(v-model="modelCalender", :before="[{icon: 'event_note'}]", type="date", hide-underline, format24h, dark, clearable, modal)
          //
            .col-6.text-right(v-if="modelCalender")
              q-btn(icon="access_time") {{ formatDate(modelCalender, 'YYYY') }}h

          // TIME
          //
          .col-6.q-list.no-border.shadow-6.q-pa-md

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

        form-main(v-model="payload", :schema="schema")

</template>

<script>
  import FormMain from '../../../components/shared/forms/FormMain'
  import FullScreen from '../../../components/shared/layouts/FullScreen'

  import { date } from 'quasar'
  import { DateTime } from 'luxon'
  import { required } from 'vuelidate/lib/validators'
  import { guessType } from '../../../lib/annotations/videos'
  import constants from '../../../lib/constants'

  export default {
    components: {
      FormMain,
      FullScreen
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
      handlerCalender () {
        this.showCalender = !this.showCalender
      },
      formatDate (val, format) {
        if (val) return date.formatDate(val, format)
      }
    },
    mounted () {
      this.sliderHours = this.formatDate(this.modelCalender, 'H')
      this.sliderMilliseconds = this.formatDate(this.modelCalender, 'SSS')
      this.sliderMinutes = this.formatDate(this.modelCalender, 'm')
      this.sliderSeconds = this.formatDate(this.modelCalender, 'S')
    },
    data () {
      const _this = this
      return {
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        // currentDate: DateTime.local().toLocaleString({ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' }),
        currentDate: DateTime.local().toLocaleString({ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' }),
        modelCalender: Date.now(),
        showCalender: false,
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
        sliderHours: null,
        sliderMilliseconds: null,
        sliderMinutes: null,
        sliderSeconds: null
      }
    }
  }
</script>

<style lang="stylus">
  .moba-hover
    vertical-align middle
  .moba-hover:hover
    background-color rgba(255, 255, 255, .025)
</style>
