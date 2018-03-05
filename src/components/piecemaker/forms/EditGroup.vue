<template lang="pug">
  form-main(v-model="payload", :schema="schema")
</template>

<script>
  import FormMain from '../../shared/forms/FormMain'
  import { QBtn } from 'quasar-framework'
  import { required } from 'vuelidate/lib/validators'
  import constants from '../../../lib/constants'
  export default {
    components: {
      FormMain,
      QBtn
    },
    props: ['redirectTo'],
    data () {
      const context = this
      return {
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
            },
            description: {
              fullWidth: true,
              type: 'textarea',
              label: 'labels.description'
            }
          },
          submit: {
            handler () {
              context.payload.owner = context.$store.state.auth.payload.userId
              context.payload.type = [constants.MAP_TYPE_TIMELINE]
              context.$store.dispatch(context.payload.uuid ? 'maps/patch' : 'maps/create', context.payload)
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
