<template lang="pug">
  center-card-three-quarter
    span(slot="form-title") {{ $t('routes.maps.create.title') }}
    p.caption(slot="form-caption") {{ $t('routes.maps.create.caption') }}
    form-main(v-model="payload", :schema="schema")
</template>

<script>
  import CenterCardThreeQuarter from '../../layouts/CenterCardThreeQuarter'
  import { FormMain } from '../../forms'
  import { required } from 'vuelidate/lib/validators'
  export default {
    components: {
      CenterCardThreeQuarter,
      FormMain
    },
    data () {
      const context = this
      return {
        payload: undefined,
        schema: {
          fields: {
            title: {
              fullWidth: true,
              type: 'text',
              label: 'labels.map_title',
              errorLabel: 'errors.field_required',
              validators: {
                required
              }
            }
          },
          submit: {
            handler () {
              context.payload.owner = context.$store.state.auth.payload.userId
              context.$store.dispatch('maps/create', context.payload)
                .then(() => context.$router.push(`/maps`))
            }
          }
        }
      }
    }
  }
</script>

<style></style>
