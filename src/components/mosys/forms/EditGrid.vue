<template lang="pug">

  // card-full
    span(slot="form-logo")
    h4 Edit Grid
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
  import CardFull from '../../shared/layouts/CardFull'

  export default {
    components: {
      FormMain,
      QBtn,
      Tags,
      CardFull
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
              label: 'routes.mosys.grids.edit.title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              context.payload.owner = context.$store.state.auth.payload.userId
              if (!context.$route.params.id) {
                context.payload.type = [constants.MAP_TYPE_2D_GRID]
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
