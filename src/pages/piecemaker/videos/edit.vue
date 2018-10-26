<template lang="pug">
  full-screen
    // q-btn(slot="backButton", @click="$router.push({ name: 'piecemaker.videos.list' })", icon="keyboard_backspace", round, small)
    back-button(slot="backButton")
    .q-px-xl(style="min-width: 50vw;")
      h5.caption(dark) {{ $t('routes.piecemaker.videos.edit.title') }}

      .row
        .col-md-12
          calendar-time-main(:datetime="selectorValue", @update="onCalendarUpdate")
          p.q-mb-lg(v-if="selectorOverride !== selectorValue") {{ $t('messages.caution_video_time_override') }}
          form-main(v-model="payload", :schema="schema")

      .row
        .col-md-12
          access-control
</template>

<script>
  import AccessControl from '../../../components/shared/partials/AccessControl'
  import CalendarTimeMain from '../../../components/shared/forms/CalendarTimeMain'
  import FormMain from '../../../components/shared/forms/FormMain'

  import { required } from 'vuelidate/lib/validators'
  import guessType from 'mbjs-media/src/util/guess-type'

  import { parseURI } from 'mbjs-data-models/src/lib'

  export default {
    components: {
      AccessControl,
      CalendarTimeMain,
      FormMain
    },
    methods: {
      onCalendarUpdate (val) {
        this.selectorOverride = val
      }
    },
    data () {
      const context = this
      return {
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        selectorOverride: undefined,
        selectorValue: undefined,
        payload: context.$store.dispatch('annotations/get', context.$route.params.id)
          .then(result => {
            this.selectorValue = result.target.selector.value
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
                target: {
                  selector: {
                    value: context.selectorOverride || context.selectorValue
                  }
                },
                body: {
                  source: {
                    id: context.payload.url,
                    type: guessType(context.payload.url)
                  }
                }
              }
              return context.$store.dispatch('annotations/patch', [context.payload.uuid, context.apiPayload])
                .then(() => context.$router.push({
                  name: 'piecemaker.videos.list',
                  params: { timelineId: parseURI(context.payload.gid).uuid }
                }))
            }
          }
        }
      }
    }
  }
</script>
