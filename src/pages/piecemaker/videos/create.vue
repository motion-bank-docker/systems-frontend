<template lang="pug">
  full-screen
    q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    h5.caption(dark).text-center {{ $t('routes.piecemaker.videos.create.title') }}
    .row
      .col-xs-12.offset-xs-none.col-xl-10.offset-xl-1
        .row.q-mt-md
          calender-time-main(v-if="staging", @getTimeAndDate="getTimeAndDate")

        form-main(v-model="payload", :schema="schema")

</template>

<script>
  import CalenderTimeMain from '../../../components/shared/forms/CalenderTimeMain'
  import FormMain from '../../../components/shared/forms/FormMain'
  import FullScreen from '../../../components/shared/layouts/FullScreen'

  import { DateTime } from 'luxon'
  import { required } from 'vuelidate/lib/validators'
  import { guessType } from 'mbjs-media/src/util/metadata'
  import constants from 'mbjs-data-models/src'

  export default {
    components: {
      CalenderTimeMain,
      FormMain,
      FullScreen
    },
    methods: {
      getTimeAndDate (val) {
        console.log(val)
      }
    },
    data () {
      const _this = this
      return {
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
        staging: process.env.IS_STAGING
      }
    }
  }
</script>

<style lang="stylus">
</style>
