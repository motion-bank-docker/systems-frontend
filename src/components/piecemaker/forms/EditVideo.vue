<template lang="pug">
  form-main(v-model="payload", :schema="schema")
</template>

<script>
  import FormMain from '../../shared/forms/FormMain'
  import { required } from 'vuelidate/lib/validators'
  import { DateTime } from 'luxon'
  import constants from '../../../lib/constants'
  export default {
    components: {
      FormMain
    },
    props: ['redirectTo'],
    data () {
      const context = this
      return {
        // FIXME: i know this is bullshit!!! (but i hope it works for now)
        apiPayload: undefined,
        payload: context.$route.params.id ? context.$store.dispatch('annotations/get', context.$route.params.id)
          .then(result => {
            return {
              url: result.body.source
            }
          }) : undefined,
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
                  source: context.payload.url,
                  type: 'Video',
                  purpose: 'linking'
                },
                author: context.$store.state.auth.payload.userId,
                target: {
                  id: context.$route.params.groupId || context.groupId,
                  type: constants.MAP_TYPE_TIMELINE,
                  selector: {
                    type: 'Fragment',
                    value: DateTime.local().toString()
                  }
                }
              }
              return Promise.resolve()
                .then(() => {
                  if (context.payload.uuid) {
                    return context.$store.dispatch('annotations/patch', [context.payload.uuid, context.apiPayload])
                  }
                  return context.$store.dispatch('annotations/create', context.apiPayload)
                })
                .then(() => {
                  context.$router.push(`/piecemaker/groups/${context.$route.params.groupId}/videos`)
                })
            }
          }
        }
      }
    }
  }
</script>
