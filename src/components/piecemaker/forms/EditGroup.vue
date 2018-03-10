<template lang="pug">
  div
    form-main(v-model="payload", :schema="schema")
    tags(v-if="payload", :targetUuid="payload.uuid", fullWidth)
</template>

<script>
  import FormMain from '../../shared/forms/FormMain'
  import { QBtn } from 'quasar-framework'
  import { required } from 'vuelidate/lib/validators'
  import constants from '../../../lib/constants'
  import Tags from '../../shared/partials/Tags'

  export default {
    components: {
      FormMain,
      Tags,
      QBtn
    },
    props: ['redirectTo'],
    data () {
      const context = this
      return {
        type: constants.MAP_TYPE_TIMELINE,
        payload: this.$route.params.id ? context.$store.dispatch('maps/get', context.$route.params.id) : undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.group_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              context.payload.author = context.$store.state.auth.payload.userId
              if (!context.$route.params.id) {
                context.payload.type = [constants.MAP_TYPE_TIMELINE]
              }
              return Promise.resolve()
                .then(() => {
                  if (context.payload.uuid) {
                    return context.$store.dispatch('maps/patch', [context.payload.uuid, context.payload])
                  }
                  return context.$store.dispatch('maps/create', context.payload)
                })
                .then(() => {
                  if (context.redirectTo) {
                    context.$router.push(context.redirectTo)
                  }
                })
            }
          }
        }
      }
    }
  }
</script>
