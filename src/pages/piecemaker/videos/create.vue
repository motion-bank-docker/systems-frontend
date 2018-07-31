<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    // .q-pa-xl(style="min-width: 50vw;")
    h5.caption(dark).text-center {{ $t('routes.piecemaker.videos.create.title') }}
    .row
      .col-md-8.offset-2
        // | > {{ getDate(modelCalender) }} <
        //
          q-datetime.q-mb-xs(v-model="modelCalender", :before="[{icon: 'access_time'}]", type="datetime", format24h, dark, clearable, modal, :placeholder="currentDate", float-label="Set date")
        // | {{ modelCalender }}
        // q-datetime.q-mb-xs(v-model="modelCalender", :before="[{icon: 'event_note'}]", type="datetime", format24h, dark, clearable, modal, :placeholder="currentDate", float-label="Set date")
        q-datetime.q-mb-xs(v-model="modelCalender", :before="[{icon: 'event_note'}]", type="date", format24h, dark, clearable, modal, :placeholder="currentDate", float-label="Set date")
        // q-datetime.q-mb-xs(v-model="modelCalender", :before="[{icon: 'event_note'}]", type="time", format24h, dark, modal, :placeholder="currentDate", float-label="Set time")
        //
          .row
            q-slider.col-10(v-model="sliderSeconds", :min="0", :max="59", label-always, :label-value="`${sliderSeconds}s`")
            q-btn(@click="sliderSeconds--", round, size="sm", icon="remove")
            q-btn(@click="sliderSeconds++", round, size="sm", icon="add", dark)
          .row
            q-slider.col-10(v-model="sliderMilliseconds", :min="0", :max="999", label-always, :label-value="`${sliderMilliseconds}ms`")
            q-btn(@click="sliderMilliseconds--", round, size="sm", icon="remove")
            q-btn(@click="sliderMilliseconds++", round, size="sm", icon="add", dark)
        | {{ modelCalender }}
        q-list.no-border(v-if="modelCalender")
          //
            q-item.no-padding
              q-item-main
                q-datetime.q-mb-xs(v-model="modelCalender", :before="[{icon: 'event_note'}]", type="time", format24h, dark, modal, :placeholder="currentDate", float-label="Set time")
              q-item-side
                | {{ modelCalender }}

          q-item.no-padding
            q-item-side
              q-btn(@click="sliderHours--", round, size="sm", icon="remove", color="grey-9")
            q-item-main
              q-slider(v-model="sliderHours", :min="0", :max="23", label-always, :label-value="`${sliderHours}h`")
            q-item-side
              q-btn(@click="sliderHours++", round, size="sm", icon="add", dark, color="grey-9")

          q-item.no-padding
            q-item-side
              q-btn(@click="sliderMinutes--", round, size="sm", icon="remove", color="grey-9")
            q-item-main
              q-slider(v-model="sliderMinutes", :min="0", :max="59", label-always, :label-value="`${sliderMinutes}min`")
            q-item-side
              q-btn(@click="sliderMinutes++", round, size="sm", icon="add", dark, color="grey-9")

          q-item.no-padding
            q-item-side
              q-btn(@click="sliderSeconds--", round, size="sm", icon="remove", color="grey-9")
            q-item-main
              q-slider(v-model="sliderSeconds", :min="0", :max="59", label-always, :label-value="`${sliderSeconds}s`")
            q-item-side
              q-btn(@click="sliderSeconds++", round, size="sm", icon="add", dark, color="grey-9")

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
      getDate (val) {
        // console.log(val, '11111111')
        // console.log(DateTime.local(), '22222222')
        let newDate = val
        newDate = date.addToDate(newDate, { month: 2 })
        console.log(newDate, 'xxxxxxxxxx')
        if (val) return date.formatDate(val, 'x')
      }
    },
    data () {
      const _this = this
      return {
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        // currentDate: DateTime.local().toLocaleString({ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' }),
        currentDate: DateTime.local().toLocaleString({ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' }),
        payload: undefined,
        modelCalender: undefined,
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
        sliderHours: 0,
        sliderMilliseconds: 0,
        sliderMinutes: 0,
        sliderSeconds: 0
      }
    }
  }
</script>
