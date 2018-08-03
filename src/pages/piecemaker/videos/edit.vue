<template lang="pug">
  full-screen
    // q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    q-btn(slot="backButton", @click="$router.push('timelines/' + payload.gid + '/videos')", icon="keyboard_backspace", round, small)
    .q-pa-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.videos.edit.title') }}
      .row
        .col-md-12
          calender-time-main
          form-main(v-model="payload", :schema="schema")
</template>

<script>
  import CalenderTimeMain from '../../../components/shared/forms/CalenderTimeMain'
  import FormMain from '../../../components/shared/forms/FormMain'
  import FullScreen from '../../../components/shared/layouts/FullScreen'

  import { required } from 'vuelidate/lib/validators'
  import { guessType } from 'mbjs-media/src/util/metadata'

  export default {
    components: {
      CalenderTimeMain,
      FormMain,
      FullScreen
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
                  params: { groupId: context.$route.params.groupId }
                }))
            }
          }
        }
      }
    }
  }
</script>
