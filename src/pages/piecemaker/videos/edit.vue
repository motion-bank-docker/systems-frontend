<template lang="pug">
  full-screen
    // q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    q-btn(slot="backButton", @click="$router.push('timelines/' + payload.gid + '/videos')", icon="keyboard_backspace", round, small)
    .q-pa-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.videos.edit.title') }}
      .row
        .col-md-12
          calendar-time-main(v-if="staging", @getTimeAndDate="getTimeAndDate")
          form-main(v-model="payload", :schema="schema")
</template>

<script>
  import CalendarTimeMain from '../../../components/shared/forms/CalendarTimeMain'
  import FormMain from '../../../components/shared/forms/FormMain'
  import { FullScreen } from 'mbjs-quasar/src/components'

  import { required } from 'vuelidate/lib/validators'
  import guessType from 'mbjs-media/src/util/guess-type'

  export default {
    components: {
      CalendarTimeMain,
      FormMain,
      FullScreen
    },
    methods: {
      getTimeAndDate (val) {
        console.log(val)
      }
    },
    data () {
      const context = this
      return {
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        payload: context.$store.dispatch('annotations/get', context.$route.params.id)
          .then(result => {
            console.log(result)
            return {
              gid: result.target.id,
              uuid: result.uuid,
              url: result.body.source.id
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
            }
          },
          submit: {
            handler () {
              context.apiPayload = {
                body: {
                  source: {
                    id: context.payload.url,
                    type: guessType(context.payload.url)
                  }
                }
              }
              console.log(context.payload, context.apiPayload)
              return context.$store.dispatch('annotations/patch', [context.payload.uuid, context.apiPayload])
                .then(() => context.$router.push({
                  name: 'piecemaker.videos.list',
                  params: { timelineId: context.$route.params.timelineId }
                }))
            }
          }
        },
        staging: process.env.IS_STAGING
      }
    }
  }
</script>
