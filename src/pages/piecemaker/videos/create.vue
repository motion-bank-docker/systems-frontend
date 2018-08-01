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
        q-datetime.q-mb-xs(v-model="modelCalender", :before="[{icon: 'event_note'}]", type="datetime", format24h, dark, clearable, modal, :placeholder="currentDate", float-label="Set date")
        form-main(v-model="payload", :schema="schema")
</template>

<script>
  import FormMain from '../../../components/shared/forms/FormMain'
  import FullScreen from '../../../components/shared/layouts/FullScreen'

  import { date } from 'quasar'
  import { DateTime } from 'luxon'
  import { required } from 'vuelidate/lib/validators'
  import { guessType } from 'mbjs-media/src/util/metadata'
  import constants from 'mbjs-data-models/src'

  export default {
    components: {
      FormMain,
      FullScreen
    },
    methods: {
      getDate (val) {
        console.log(val, '11111111')
        console.log(DateTime.local(), '22222222')
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
        modelCalender: 1477298414674,
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
